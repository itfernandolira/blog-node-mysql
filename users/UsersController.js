const express=require("express");
const User = require("./User");
const bcrypt=require('bcryptjs');
const router=express.Router();
const adminAuth=require("../middlewares/adminAuth");

router.get("/admin/users",adminAuth,(req,res)=>{
    User.findAll({raw: true, order: [
        ['email','ASC']
    ]}).then(users => {
        res.render("admin/users/index",{
            users: users
        });
    });
});

router.get("/admin/users/create",adminAuth,(req,res)=>{
    res.render("admin/users/create");
});

router.post("/users/save",adminAuth,(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;

    User.findOne({where: {email: email}}).then (user => {
        if (user==undefined){
            var salt=bcrypt.genSaltSync(10);
            var hash=bcrypt.hashSync(password,salt);
            if (email!=undefined){
                User.create({
                    email: email,
                    password: hash
                }).then(()=>{
                    res.redirect("/admin/users");
                });
            } else {
                res.redirect("/admin/users");
            }
        }else {
            res.redirect("/admin/users/create");
        }
    });
});

router.get("/login",(req,res)=>{
    res.render("admin/users/login");
});

router.post("/authenticate",(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;

    User.findOne({where: {email: email}}).then(user =>{
        if (user!= undefined){
            var correct=bcrypt.compareSync(password,user.password);
            if (correct){
                req.session.user ={
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else {
                res.redirect("/login");
            }
        }
        else {
            res.redirect("/login");
        }
    });

});

router.get("/logout",(req,res)=>{
    req.session.user=undefined;
    res.redirect("/");
});

module.exports=router;