
const express = require("express");
const app = express();
const mysql = require("mysql");
const path= require('path');
const cookieParser = require('cookie-parser');

const dotenv = require ('dotenv');
dotenv.config({path: './.env'})



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect( (error)=> {
    if(error){
        console.log(error)
    }
    else {
        console.log("MySql Connected....")
    }
})



const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory)); 


app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use(cookieParser());



app.set('view engine','hbs');


//Define Routes 
app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'));






app.listen(5005, () => {
    console.log("Server started on http://localhost:5005/sellerregister");
    console.log("Server started on http://localhost:5005/buyerregister");
    console.log("Server started on http://localhost:5005/muncipalityregister");
})







