const mongoose = require("mongoose")
const validate = require("../validation/validator")


const userSchema = new mongoose.Schema({


    title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"] ,trim:true},
    name: { type: String, required: true,trim:true },
    phone: { type: String, required: true, unique: true,trim:true },
    email: {
        type: String, required: true, unique: true,trim:true
    },
    password: { type: String, required: true,trim:true },
    address: {
        street: { type: String,trim:true },
        city: { type: String,trim:true },
        pincode: { type: String,trim:true }
    },
},{ timestamps: true })


module.exports = mongoose.model('user', userSchema)