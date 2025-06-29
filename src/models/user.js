const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema({
    firstName: { 
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20

     },
    lastName: { type: String },
    emailId: { 
        type: String,
        index: true,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email-ID"+ value);
            }
        }

     },
    password: { type: String },
    age: { type: Number,
        min : 18,
        default: 18
     },
     gender: {
        type: String,
        validate(val){
            if(!["male","female","others"].includes(val)){
                throw new Error("Not a valid type");
            }
        }
     }

},{timestamps:true});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
