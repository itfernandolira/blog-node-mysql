const express=require("express");
const router=express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const User = require("../users/User");
const bcrypt=require('bcryptjs');
const slugify=require("slugify");
const jwt=require("jsonwebtoken");
const apiAuth=require("../middlewares/apiAuth");

const JWTSecret="djkfkjddgdfsdfg";

router.get("/api/categories",apiAuth,(req,res)=>{
    Category.findAll({raw: true, order: [
        ['id','DESC']
    ]}).then(categories => {
        res.status(200);
        res.json(categories);
    });
});

router.get("/api/articles",apiAuth,(req,res)=>{

    Article.findAll({raw: true, 
        order: [['id','DESC']
    ]}).then(articles => {
        res.status(200);
        res.json(articles);
    });
});

router.get("/api/categories/:id",apiAuth,(req,res) => {
    if (!isNaN(req.params.id)) {
        var id=parseInt(req.params.id);
        Category.findByPk(id).then(category => {
            if (category!=undefined) {
                res.status(200);
                res.json(category);
            }else {
                res.status(404);
                res.json({err: "Not found!"});
            }
        }).catch(error => {
                res.status(400);
                res.json({err: "Failure!"});
        });
    } 
    else {
        rres.status(400);
        res.json({err: "Invalid category id!"});
    }
});

router.get("/api/articles/:id",apiAuth,(req,res) => {
    if (!isNaN(req.params.id)) {
        var id=parseInt(req.params.id);
        Article.findByPk(id).then(article => {
            if (article!=undefined) {
                res.status(200);
                res.json(article);
            }else {
                res.status(404);
                res.json({err: "Not found!"});
            }
        }).catch(error => {
            res.status(400);
            res.json({err: "Failure!"});
        });
    } 
    else {
        res.status(400);
        res.json({err: "Invalid article id!"});
    }
});

router.post("/api/categories",apiAuth,(req,res)=>{
    var title=req.body.title;
    if (title!=undefined){
        Category.create({
            title: title,
            slug: slugify(title,{
                lower: true
            })
        }).then(()=>{
            res.status(201);
            res.json();
        });
    } else {
        res.status(400);
        res.json({err: "Invalid category title!"});
    }
});

router.post("/api/articles",apiAuth,(req,res)=>{
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
            res.status(201);
            res.json();
        });
    } else {
        res.status(400);
        res.json({err: "Invalid article!"});
    }
});

router.delete("/api/categories/:id",apiAuth,(req,res)=>{
    var id=req.params.id;
    if (id!=undefined){
        Category.destroy({
            where : {
                id:id
            }
        }).then((num)=>{
            if (num==1) {
                res.status(200);
                res.json();
            } 
            else {
                res.status(404);
                res.json({err: "Category not found!"});
            }
        });
    } else {
        res.status(400);
        res.json({err: "Invalid category id!"});
    }
});

router.delete("/api/articles/:id",apiAuth,(req,res)=>{
    var id=req.params.id;
    if (id!=undefined){
        Article.destroy({
            where : {
                id:id
            }
        }).then((num)=>{
            if (num==1) {
                res.status(200);
                res.json();
            }
            else {
                res.status(404);
                res.json({err: "Article not found!"});
            }
           
        });
    } else {
        res.status(400);
        res.json({err: "Invalid article id!"});
    }
});

router.put("/api/categories/:id",apiAuth,(req,res)=> {
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
                res.status(200);
                res.json();
            } else {
                res.status(404);
                res.json({err: "Category not found!"});
            }
            
        });
    } else {
        res.status(400);
        res.json({err: "Invalid Category!"});
    }
});

router.put("/api/articles/:id",apiAuth,(req,res)=> {
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
                res.status(404);
                res.json({err: "Article not found!"});
            }
        });

    } else {
        res.status(404);
        res.json({err: "Invalid article!"});
    }
});

router.post("/api/auth",(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;

    if (email!=undefined) {
        User.findOne({where: {email: email}}).then(user =>{
            if (user!= undefined){
                var correct=bcrypt.compareSync(password,user.password);
                if (correct){
                    
                    jwt.sign({email: user.email},JWTSecret,{expiresIn: '2h'},(err, token)=> {
                        if (err) {
                            res.status(400);
                            res.json({err: "Failure!"});
                        } else {
                            res.status(200);
                            res.json({token: token});
                        }
                    });


                }else {
                    res.status(401);
                    res.json({err: "Wrong password!"});
                }
            }
            else {
                res.status(404);
                res.json({err: "E-mail not found!"});
            }
        });
    } else {
        res.status(400);
        res.json({err: "Invalid e-mail!"});
    }

    
});

module.exports=router;