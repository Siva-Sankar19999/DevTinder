const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

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
        enum : {
          values : ["male","female","others"],
          messgae : `{VALUE} is incorrect gender type`
        }
     },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    }

},{timestamps:true});



userSchema.methods.generateJWT = async function(){
    const user = this;
    const token = await jwt.sign({userId:this._id},"DEV@TENDER$01",{expiresIn:"7d"});
    return token;
}

userSchema.methods.validatePassword = async function(userInputPassword){
    const user = this;
    console.log(user.password,'password..!');
    const isPasswordValid = await bcrypt.compare(userInputPassword,user.password);
    return isPasswordValid;
}


module.exports = mongoose.model("User", userSchema);
