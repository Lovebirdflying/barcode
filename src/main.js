require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const  bodyparser = require("body-parser");
const validator = require("email-validator")
const userModel = require('./helper/db')


const app = express()
const PORT = process.env.PORT || 1000;

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json()); 


app.get('/', (req, res) => {
    res.send('Home Page');
});

app.post('/add', async(req, res)=>{

    const { name, email, phone, ProfileImage } = req.body;

    if (!name || !email || !phone || !ProfileImage ) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (!validator.validate(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {   
    
    const user = await  userModel.create({
     name, 
     email,
     phone,
     ProfileImage,

}

)

res.status(200).json("user added successfully")}

catch(err) {
    res.status(500).json({
        message: "unable to add user", 
        error: err.message 
    });
}
});


app.get('/getUser', async (req, res)=>{
    const userUID = req.body.userUID;
    //const user = finduserId(userUID);
 

    userModel.findOne({_id : userUID})
    .then((user) =>{
        if(!user ){

            res.status(404).json({error :" user on the data base does not exist"})
           
        }else {
            res.status(200).json(user)
        }
    })
    .catch((err)=> {
        res.status(500).json({message: "Unknown error", err})
    });
    

})

/*
app.get('/', ( req, res) => {

    res.send('Hi APP')
});
*/


mongoose.connect(process.env.MONGO)
.then((done) => {
    console.log("MongoDB connected successfully ")
    
    app.listen(PORT, () => {
        console.log(`server started http://localhost:${PORT}`)
    })

})
.catch((err) => {
    console.log(`an error occured while trying to connect to mongoDB. ${err}`)


})

/*
app.listen(PORT, () => {
    console.log(`server started http://localhost:${PORT}`)
})
*/