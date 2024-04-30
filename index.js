// Importando módulos necessários
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt')
const collection = require('./configs');
const exp = require('constants');

// Inicializando o aplicativo Express
const App = express();

// Configurando o middleware para converter dados recebidos em formato JSON
App.use(express.json());
App.use(express.urlencoded({extended: false}));

// Configurando o EJS como mecanismo de visualização
App.set('view engine', 'ejs')

// Configurando o middleware para servir arquivos estáticos
App.use(express.static(path.join(__dirname, 'src/assets')));
App.use(express.static(path.join(__dirname, 'public')));

// Rotas GET para renderizar as páginas
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

// Rota POST para cadastro
App.post("/register", async (req, res) =>{
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }

    // Verificando se o usuário já existe
    const existUser = await collection.findOne({name: data.name})

    if(existUser){
        // OBS: Não é uma boa pratica
        res.send('<script>alert("Usuário já está em uso, volte e crie um novo usuário"); window.location.href="/register";</script>');
    } else {
        // Encriptando a senha
        const saltRounds = 10;
        const  encryptPass = await bcrypt.hash(data.password, saltRounds);

        data.password = encryptPass;

        // Redirecionando para a página inicial após o registro
        const userData = await collection.insertMany(data);
        res.redirect('/home');
    }
})

// Rota POST para login
App.post("/login", async (req, res) =>{
    try {
        const checkUser = await collection.findOne({name: req.body.username});

        if(!checkUser){
            res.send('<script>alert("Usuario não encontrado"); window.location.href="/login";</script>');
        }

        // Comparando a senha
        const isPwdCorrect = await bcrypt.compare(req.body.password, checkUser.password);
        if(isPwdCorrect){
            res.redirect("/home")
        }
    } catch {
        res.send('<script>alert("Não foi possivel fazer login"); window.location.href="/login";</script>');
    }
})

// Iniciando o servidor na porta 5000
const port = 5000;
App.listen(port, () => {
    console.log(`Funcionando`)
})
