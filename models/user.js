const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const schema =  mongoose.Schema

const userSchema = new schema({
    name:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        maxlength:255,
    },
    password:{
        type:String,
        required:true

    },
    isAdmin:Boolean
})
//  this will create auth token for users
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id,isAdmin:this.isAdmin} , 'JwtPrivateKey');
    return token;
}
const users = mongoose.model('User' , userSchema);
module.exports = users