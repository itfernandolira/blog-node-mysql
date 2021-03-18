const jwt=require("jsonwebtoken");
const JWTSecret="djkfkjddgdfsdfg";

function apiAuth(req,res,next) {
    const authToken=req.headers['authorization'];

    if (authToken!=undefined) {

        const bearer=authToken.split(' ');
        var token=bearer[1];

        jwt.verify(token,JWTSecret,(err,data)=>{
            if (err) {
                res.status(401);
                res.json({err:"Invalid token!"});
            } else {
                req.token=token;
                req.loggedUser={email: data.email};

                next();

            }
        });
    } else {
        res.status(401);
        res.json({err: "Invalid token!"});
    }
}

module.exports=apiAuth;