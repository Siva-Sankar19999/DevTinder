const express = require('express');
const connectDB = require("./config/database");


const app = express();


connectDB()
.then(()=>{
    console.log("Database connected successfully..!");
    app.listen(3000,()=>{
    console.log('server listening on port 3000');});
})
.catch(()=>{
    console.log("Database is not connected successfully..!");
});


