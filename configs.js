// Importando o módulo mongoose
const mongoose = require('mongoose');

// Conectando ao banco de dados MongoDB local na porta 27017, no banco de dados chamado 'devweb'
const connect = mongoose.connect("mongodb://localhost:27017/devweb");

// Verificando se a conexão com o banco de dados foi bem-sucedida
connect.then(()=>{
    console.log("Connected to DataBase");
})
.catch(() => {
    console.log("Database not Connect");
})

// Definindo o esquema para os usuários no banco de dados
// Este esquema inclui nome, email e senha, todos os campos são obrigatórios
const loginSchemaUser = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// Criando um modelo Mongoose usando o esquema definido acima. 
// Este modelo será usado para interagir com a coleção 'users' no banco de dados
const collection = new mongoose.model("users", loginSchemaUser);

// Exportando o modelo para que possa ser usado em outros arquivos
module.exports = collection;
