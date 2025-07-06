const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validateData = require("./utils/validator");
const cookieParser = require("cookie-parser");
const userAuth = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res, next) => {
    try {
        validateData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHashed = await bcrypt.hash(password, 10);
        // creating document
        const user1 = new User({ firstName, lastName, emailId, password: passwordHashed });
        await user1.save();

        res.send("Data Posted successfullly");
    } catch (err) {
        res.status(401).send("Issue occured while signing up..!" + err);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Email-Id...");
        }
        const isPaswordValid = await user.validatePassword(password);

        if (isPaswordValid) {
            const token = await user.generateJWT();
            res.cookie("token", token,{ expires: new Date(Date.now() + 7 * 24* 60 * 60 * 1000) });
            res.send("Login Successfully..!🥳");
        } else {
            throw new Error("Invalid Password..!❌");
        }

    }catch(err){
        res.status(401).send("Issue occured while logging up..!"+ err);
    }
});



app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(401).send("Issue occured while getting profile.." + err);
    }
});


app.post('/sendConnectionRequest',userAuth, async(req,res)=>{
    try{
        const user = req.user;
        res.send(`${user.firstName}, sends a connection request..!`);
    }
    catch(err){
        res.status(401).send("Issue occured while sending connection request.." + err);
    }
});



app.use((req, res) => {
    res.status(404).send("No Route there for that request..!");
});

app.use((err, req, res, next) => {
    console.log("executing..!");
    if (err) {
        res.status(401).send("GOT issue ..!");
    } else {
        res.status(404).send("No route there bhayaa...!");
    }
});

connectDB()
    .then(() => {
        console.log("Database connected successfully..!");
        app.listen(3000, () => {
            console.log("server listening on port 3000");
        });
    })
    .catch(() => {
        console.log("Database is not connected..!");
    });
