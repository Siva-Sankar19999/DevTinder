const validate = require('validator');

const validateSignupData = (req)=>{
   const {firstName, lastName, emailId, password, age, gender} = req.body;
   if(!firstName || !lastName){
    throw new Error("Name not found");
   }else if(!validate.isEmail(emailId)){
    throw new Error("Invalid Email-Id");
   }else if(!validate.isStrongPassword(password)){
    throw new Error("Please enter strong password");
   }
}

module.exports = validateSignupData;