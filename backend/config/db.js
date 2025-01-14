const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async() => {
    try {

        console.log("conectando");
       const dnConn = await mongoose.connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.t5oi0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
       )
       console.log("conectou");

       return dnConn;

    } catch(error) {
        console.log(error)
    }
}

conn();

module.exports = conn;