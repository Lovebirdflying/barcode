const express = require('express');
const router = express.Router();
const validator = require("email-validator")

router.get('/', (req, res) => {
    res.send('Home Page');
});

router.post('/add', async(req, res)=>{

    const { name, email, phone, ProfileImage } = req.body;

    if (!name || !email || !phone || !ProfileImage) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (!validator.validate(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {const user = await  userModel.create({
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


module.exports = router;