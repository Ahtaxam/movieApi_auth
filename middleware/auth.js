const jwt = require('jsonwebtoken')

function auth(req , res , next){
    const token = req.header('x-auth-token');
    if(!token){
        res.status(401).send('Access Denied! No token provided...');
        return;
    }
    else{
        try{
            const decode = jwt.verify(token , 'JwtPrivateKey');
            req.user = decode;
            next();
        }
        catch(e){
            res.status(400).send('Invalid Token')
        }
    }

}

module.exports = auth;