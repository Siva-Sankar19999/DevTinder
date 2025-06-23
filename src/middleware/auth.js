const adminAuth = (req,res,next)=>{
    console.log("USE route console");
    const token = "xyz";
    if(token == "xyze"){
        next();
    }
    else{
        res.setstatus("401").send("Unauthorized Access")
    }
}

module.exports = {adminAuth};