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

const validateProfileEditData = (req) =>{
   const updateFeilds = req.body;
   const allowedEditFields = ["firstName","lastName","photoUrl","gender","age","about","skills"];
   const isAllowedData = Object.keys(updateFeilds).every(val=>allowedEditFields.includes(val));
   return isAllowedData;

}

module.exports = {
   validateSignupData,
   validateProfileEditData
}