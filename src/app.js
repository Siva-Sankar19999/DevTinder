const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

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
