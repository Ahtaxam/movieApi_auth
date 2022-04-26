const express = require('express')
const jwt = require('jsonwebtoken')
const joi = require('joi')
const bodyParser = require('body-parser')
const User = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Auth = express.Router()

Auth.use(bodyParser.json())

Auth.post('/' , async (req , res) =>{
    const result = validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }
    const user = await User.findOne({email:req.body.email});
    if(!user){
        res.status(400).send('Invalid Username or password');
        return;
    }
    else{
        const validate = await bcrypt.compare(req.body.password,user.password );
        if(!validate){
            res.status(400).send('Invalid Username or password')
        }
        else{
            // second parameter is private key, it always defined in different file not here in code base
            // const token = jwt.sign({_id:user._id} , 'JwtPrivateKey'); 
            const token = user.generateAuthToken();
            res.status(200).send(token);
        }
    }
})

function validateUser(user){
    let email = user.email;
    let password = user.password;
    const schema = joi.object({
        email:joi.string().max(255).required().email(),
        password:joi.string().required()
    })

    return  schema.validate({email:email,password:password})
}

module.exports = Auth