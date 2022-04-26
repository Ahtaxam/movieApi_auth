const express = require('express')
const bodyParser = require('body-parser')
const joi = require('joi')
const route = express.Router()
const movie = require('../models/movie')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
route.use(bodyParser.json())

route.get('/' , async (req , res) =>{
    const movies = await movie.find({}).select('name person');
    res.status(200).send(movies)
})

route.get('/:Id' , async (req , res) =>{
    try{
        const moviee = await movie.findById(req.params.Id);
        res.status(200).send(moviee)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
route.post('/' ,auth, async (req , res) =>{
    const result = validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message)
    }

   else{
        let movies =  new movie({
            name:req.body.name,
            person:req.body.person
        })

        try{
            const m = await movies.save();
            res.status(200).send(m);
        }
        catch(e){
            res.status(400).send(e.message);
        }
    }
   
})

route.put('/:id' , async (req , res) =>{
    const result = validate(req.body);
    if(result.error){
        res.status(400).send('Could not update');
        return
    }

    try{
        const updated = await movie.findByIdAndUpdate(req.params.id , 
            {name:req.body.name,person:req.body.person},
            {new:true}
            )
        res.status(200).send(updated)
    
    }
    catch(error){
        console.log(error.message);
        res.status(400).send(error.message)
    }


})

route.delete('/:id',[auth,admin] ,async (req , res) =>{
    try{
        const deleted = await  movie.findByIdAndDelete(req.params.id);
        res.status(200).send(deleted)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})

function validate(movie){
    let name = movie.name;
    let person = movie.person;
    const Schema = joi.object({
        name:joi.string().min(3). required(),
        person:joi.string().min(3).required()
    })

    return Schema.validate({name:name,person:person})
}

module.exports = route