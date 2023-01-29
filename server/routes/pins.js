const router = require("express").Router()
const Pin = require("../models/Pin")

//Create a pin and store to db
router.post("/", async(req, res) => {   //API/PINS/
    const pinCandidate = new Pin(req.body)

    try{
        const savedPin = await pinCandidate.save()
        res.status(200).json(savedPin)
        console.log('\x1b[42m%s\x1b[0m', "[SUCCESS] Pin added to DB!")

    }catch(err){
        console.log('\x1b[41m%s\x1b[0m', "[FAILED] Pin not added to DB!")
        res.status(500).json(err)
    }
})  


//Get all pins
router.get("/", async(req, res) => {
    try{
        const pins = await Pin.find()
        console.log('\x1b[42m%s\x1b[0m', "[SUCCESS] Finding all pins!")
        res.status(200).json(pins)

    }catch (err) {
        console.log('\x1b[41m%s\x1b[0m', "[FAILED] Finding all pins!")
        res.status(500).json(err)
    }
})

module.exports = router