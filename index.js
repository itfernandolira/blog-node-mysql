const express=require("express");
const app=express();

const bodyParser=require("body-parser");

const session=require("express-session");

const connection=require("./database/database");

const categoriesController=require("./categories/CategoriesController");
const articlesController=require("./articles/ArticlesController");
const usersController=require("./users/UsersController");
const apiController=require("./api/ApiController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

app.set('view engine','ejs');
app.use(express.static('public'));

app.use(session({
    secret: "FkjdD33s",
    cookie: {maxAge: 600000}
}));

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

app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController);
app.use("/",apiController);

app.get("/",(req,res)=>{
    Article.findAll({
        order: [['id','DESC']]
    }).then(articles => {
            Category.findAll().then(categories=>{
                res.render("index",{
                    articles: articles,
                    categories: categories
                });
            });
           
        });
});

app.get("/axios",(req,res)=>{
    res.render("axios");
});

app.get("/:slug",(req,res)=>{
    var slug=req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article!=undefined){
            Category.findAll().then(categories=>{
                res.render("article",{
                    article: article,
                    categories: categories
                });
            });
        } else {
            res.redirect("/");
        }
    }).catch(err=>{
        res.redirect("/");
    });
});

app.get("/category/:slug",(req,res)=>{
    var slug=req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if (category!=undefined) {
            Category.findAll().then(categories=>{
                res.render("index",{
                    articles: category.articles,
                    categories: categories
                });
            });
        } else {
            res.redirect("/");
        }
    }).catch(err=>{
        res.redirect("/");
    });
});

app.listen(4000,()=>{
    console.log("Servidor ativo!");
});