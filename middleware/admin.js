function admin(req , res , next){
    if(!req.user.isAdmin){
        res.status(403).send('Access Denied')
        return;
    }
    else{
        next()
    }
}

module.exports = admin;