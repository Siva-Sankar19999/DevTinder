const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://sivasankar:6Z0Ukb8PosskQMgw@namastey-node.u6zm5vi.mongodb.net/devTinder");
}

module.exports = connectDB;