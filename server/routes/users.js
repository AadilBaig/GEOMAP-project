const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require('bcrypt')

//register
router.post("/register", async(req, res) => {

    try{
        //generate password
        const salt = await bcrypt.genSalt(10)
        const cryptedPass = await bcrypt.hash(req.body.pass, salt) //makes hashing and adds "salt"/extra characters for safety

        //create a new user
        const newUser = new User({
            userName : req.body.userName,
            email : req.body.email,
            pass : cryptedPass,
        })

        //push user to DB
        const userSaved = await newUser.save()
        console.log('\x1b[42m%s\x1b[0m', "[SUCCESS] Registering user!")
        res.status(200).json(userSaved._id)

    }catch(err){
        console.log('\x1b[41m%s\x1b[0m', "[FAILED] Registering user!")
        res.status(500).json(err)
    }
})

//login

router.post("/login", async(req, res) => {
    try{
        //find a specific user
        const user = await User.findOne({userName : req.body.userName})

        if(!user){
            console.log('\x1b[41m%s\x1b[0m', "[FAILED] Logging into user!")
            res.status(400).json("Incorrect username or password!")

        } else {
            //validate password
            const vaildPass = await bcrypt.compare(req.body.pass, user.pass)

            if(!vaildPass){
                console.log('\x1b[41m%s\x1b[0m', "[FAILED] Logging into user!")
                res.status(400).json("Incorrect username or password!")

            }else { 
                console.log('\x1b[42m%s\x1b[0m', "[SUCCESS] Logging into user!")
                res.status(200).json(user)
            }
        }
        
    }catch (err) {
        console.log('\x1b[41m%s\x1b[0m', "[FAILED] Logging in with user!")
        res.status(500).json(err)
    }
})

module.exports = router