const mongoose = require('mongoose');
const schema =  mongoose.Schema

const movieSchema = new schema({
    name:{
        type:String,
        required:true,
        unique:true
        
    },
    person:{
        type:String,
        required:true
    }
})

const movie = mongoose.model('Movie' , movieSchema);
module.exports = movie