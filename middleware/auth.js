const jwt = require('jsonwebtoken');


module.exports=(req,res,next)=>{
    const authHeader = req.get('Authorization');
    if(!authHeader){
       req.isAuth = false;
       return next();
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'somesupersecretkeyusedtoverifythetoken'); //decodes & verifies the token by same key used in resolver jwt.sign
    } catch(err){
        req.isAuth = false;
        return next();
    }
    if(!decodedToken){ //token not verified (not attached)
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};