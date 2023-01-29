const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        min : 3,
        max : 20,
        unique : true,
    },

    email : {
        type : String,
        required : true,
        max : 50,
        unique : true,
    }, 

    pass : {
        type : String,
        required : true,
        min : 6,

    }
}, {timestamps : true})

module.exports = mongoose.model("User", userSchema)