const express = require('express');
const auth = require('../middleware/auth')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const User = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const userRoute = express.Router()

userRoute.use(bodyParser.json())

userRoute.get('/me' ,auth , async (req , res) =>{
    const user = await User.findById(req.user._id).select('-password');
    // const users = await User.find({});
    res.status(200).send(user)
})

userRoute.post('/' , async (req , res) =>{
    const result = validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }
    const user = await User.findOne({email:req.body.email});
    if(user){
        res.status(400).send('User Already registered...')
        return;
    }
    else{
        let user = new User(_.pick(req.body , ['name' , 'email' , 'password']))
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password , salt);

        try{
            user = await user.save();
            // const token = jwt.sign({_id:user._id} , 'JwtPrivateKey'); 
            const token = user.generateAuthToken();
            res.status(200).header('x-auth-token' , token).send(_.pick(user , ['_id' , 'name' , 'email']))
        }
        catch(error){
            res.status(400).send(error.message)
        }
    }
})

function validateUser(user){
    let name = user.name;
    let email = user.email;
    let password = user.password;

    const schema = joi.object({
        name:joi.string().min(3).required(),
        email:joi.string().max(255).required().email(),
        password:joi.string().required()
    })

    return  schema.validate({name:name,email:email,password:password})
}

module.exports = userRoute