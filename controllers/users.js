const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../config/keys');


const registerUser = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if (user) {
        return res.status(400).json({msg:"User already Exists"})
    }
    else {    
        const newUser = await new User(req.body)
        if (req.body.password !== req.body.password2) {
            return res.status(400).json({password: "Passwords do not match"})
        }
        // hash and salt password
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash; 
                newUser.save() 
                .then(user => res.json({ success: true, token: 'Bearer ' + token(user) }))
                .catch(err => res.status(400).json({msg: err.message}))
            })
        })
    }
}

const loginUser = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if (user) {
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (isMatch) res.json({ success: true, token: 'Bearer ' + token(user) }) 
        else res.status(400).json({password: 'Incorrect Password'});
    }
    else {
        return res.status(400).json({error: "user does not exist"})
    }
}

const token = user => {
    const payload =  { id: user._id, email: user.email }
    return jwt.sign(payload, secretOrKey, { expiresIn: 3600 }) 
}


module.exports = { registerUser, loginUser };