const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/devweb");

// check valid run db
connect.then(()=>{
    console.log("Connected to DataBase");
})
.catch(() => {
    console.log("Database not Connect");
})
// INSERT DATA TO DB
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

const collection = new mongoose.model("users", loginSchemaUser);

module.exports = collection;


