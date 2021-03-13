const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const connection=require("./database/database");

app.set('view engine','ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection
    .authenticate()
    .then(()=> {
        console.log("Success!");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.get("/",(req,res)=>{
    res.render("index");
});

app.listen(4000,()=>{
    console.log("Servidor ativo!");
});