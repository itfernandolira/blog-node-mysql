const express=require("express");
const router=express.Router();
const Category = require("../categories/Category");
const slugify=require("slugify");
const Article = require("./Article");
const adminAuth=require("../middlewares/adminAuth");

router.get("/admin/articles",adminAuth,(req,res)=>{
    Article.findAll({
        include: [{model: Category}],
        order: [['title','ASC']]
    }).then(articles => {
            res.render("admin/articles/index",{
                articles: articles
            });
        });
});

router.get("/admin/articles/new",adminAuth,(req,res)=>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories: categories});
    })
});

router.post("/articles/save",adminAuth,(req,res)=>{
    var title=req.body.title;
    var body=req.body.body;
    var categoryId=req.body.category;
    if (title!=undefined){
        Article.create({
            title: title,
            body: body,
            categoryId: categoryId,
            slug: slugify(title,{
                lower: true
            })
        }).then(()=>{
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles");
    }
});

router.post("/articles/delete",adminAuth,(req,res)=>{
    var id=req.body.id;
    if (id!=undefined){
        Article.destroy({
            where : {
                id:id
            }
        }).then(()=>{
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id",adminAuth,(req,res) => {
    var id=req.params.id;
    Article.findByPk(id).then(article => {
        if (article!=undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit",{article: article, categories: categories});
            })
        }else {
            res.redirect("/admin/articles");
        }
    }).catch(error => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/update",adminAuth,(req,res)=> {
    var id=req.body.id;
    var title=req.body.title;
    var body=req.body.body;
    var categoryId=req.body.category;

    Article.update({
        title: title,
        slug: slugify(title,{
            lower: true
        }),
        body: body,
        categoryId: categoryId
    },{
        where : {
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    });
});

module.exports=router;