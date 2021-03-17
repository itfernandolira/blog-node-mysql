const express=require("express");
const router=express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const adminAuth=require("../middlewares/adminAuth");
const slugify=require("slugify");

router.get("/api/categories",(req,res)=>{
    Category.findAll({raw: true, order: [
        ['id','DESC']
    ]}).then(categories => {
        res.statusCode=200;
        res.json(categories);
    });
});

router.get("/api/articles",(req,res)=>{

    Article.findAll({raw: true, 
        order: [['id','DESC']
    ]}).then(articles => {
        res.statusCode=200;
        res.json(articles);
    });
});

router.get("/api/categories/:id",(req,res) => {
    if (!isNaN(req.params.id)) {
        var id=parseInt(req.params.id);
        Category.findByPk(id).then(category => {
            if (category!=undefined) {
                res.statusCode=200;
                res.json(category);
            }else {
                res.statusCode=404;
                res.json();
            }
        }).catch(error => {
            res.statusCode=400;
            res.json();
        });
    } 
    else {
        res.statusCode=400;
        res.json();
    }
});

router.get("/api/articles/:id",(req,res) => {
    if (!isNaN(req.params.id)) {
        var id=parseInt(req.params.id);
        Article.findByPk(id).then(article => {
            if (article!=undefined) {
                res.statusCode=200;
                res.json(article);
            }else {
                res.statusCode=404;
                res.json();
            }
        }).catch(error => {
            res.statusCode=400;
            res.json();
        });
    } 
    else {
        res.statusCode=400;
        res.json();
    }
});

router.post("/api/categories",(req,res)=>{
    var title=req.body.title;
    if (title!=undefined){
        Category.create({
            title: title,
            slug: slugify(title,{
                lower: true
            })
        }).then(()=>{
            res.statusCode=201;
            res.json();
        });
    } else {
        res.statusCode=400;
        res.json();
    }
});

router.post("/api/articles",(req,res)=>{
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
            res.statusCode=201;
            res.json();
        });
    } else {
        res.statusCode=400;
        res.json();
    }
});

router.delete("/api/categories/:id",(req,res)=>{
    var id=req.params.id;
    if (id!=undefined){
        Category.destroy({
            where : {
                id:id
            }
        }).then((num)=>{
            if (num==1) {
                res.statusCode=200;
                res.json();
            } 
            else {
                res.statusCode=404;
                res.json();
            }
        });
    } else {
        res.statusCode=400;
        res.json();
    }
});

router.delete("/api/articles/:id",(req,res)=>{
    var id=req.params.id;
    if (id!=undefined){
        Article.destroy({
            where : {
                id:id
            }
        }).then((num)=>{
            if (num==1) {
                res.statusCode=200;
                res.json();
            }
            else {
                res.statusCode=404;
                res.json();
            }
           
        });
    } else {
        res.statusCode=400;
            res.json();
    }
});

router.put("/api/categories/:id",(req,res)=> {
    var id=req.params.id;
    var title=req.body.title;

    if (!isNaN(req.params.id)) {

        Category.update({
            title: title,
            slug: slugify(title,{
                lower: true
            })
        },{
            where : {
                id: id
            }
        }).then((num)=>{
            if (num==1) {
                res.statusCode=200;
                res.json();
            } else {
                res.statusCode=404;
                res.json();
            }
            
        });
    } else {
        res.statusCode=400;
        res.json();
    }
});

router.put("/api/articles/:id",(req,res)=> {
    var id=req.params.id;
    var title=req.body.title;
    var body=req.body.body;
    var categoryId=req.body.category;

    if (!isNaN(req.params.id)) {

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
        }).then((num)=>{
            if (num==1) {
                res.statusCode=200;
                res.json();
            } else {
                res.statusCode=404;
                res.json();
            }
        });

    } else {
        res.statusCode=400;
        res.json();
    }
});

module.exports=router;