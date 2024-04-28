const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt')
const collection = require('./configs');
const exp = require('constants');

const App = express();
// convert-data into json format
App.use(express.json());
App.use(express.urlencoded({extended: false}));
// Usando EJS
App.set('view engine', 'ejs')
// Servindo arquivos estáticos
App.use(express.static(path.join(__dirname, 'src/assets')));
//Usinf stactic file
App.use(express.static(path.join(__dirname, 'public')));
//
App.get("/", (req, res) => {
    res.render("login");
})
App.get("/register", (req, res) => {
    res.render("register");
})
App.get("/login", (req, res) => {
    res.render("login");
})
App.get("/home", (req, res) => {
    res.render("home");
})
App.get("/forget", (req, res) => {
    res.render("forget");
})

//CADASTRO
App.post("/register", async (req, res) =>{
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }

    // verificando usuario
    const existUser = await collection.findOne({name: data.name})

    if(existUser){
        res.send('<script>alert("Usuário já está em uso, volte e crie um novo usuário"); window.location.href="/register";</script>');
    } else {
        // Encript password
        const saltRounds = 10;
        const  encryptPass = await bcrypt.hash(data.password, saltRounds);

        data.password = encryptPass;

        // Redirecionar para a página inicial após o registro
        const userData = await collection.insertMany(data);
        console.log(userData)
        res.redirect('/home');
    }
})

// LOGIN
App.post("/login", async (req, res) =>{
    try {
        const checkUser = await collection.findOne({name: req.body.username});

        if(!checkUser){
            // Uma melhor prática seria re-renderizar a página de registro com uma mensagem de erro. Isso pode ser feito usando o sistema de templates do seu servidor (como EJS, Pug, Handlebars, etc.)
            res.send('<script>alert("Usuario não encontrado"); window.location.href="/login";</script>');
        }
        // comparando senha
        const isPwdCorrect = await bcrypt.compare(req.body.password, checkUser.password);
        if(isPwdCorrect){
            res.redirect("/home")
        }
    } catch {
        res.send('<script>alert("Não foi possivel fazer login"); window.location.href="/login";</script>');
    }
})

const port = 5000;
App.listen(port, () => {
    console.log(`Funcionando`)
})
