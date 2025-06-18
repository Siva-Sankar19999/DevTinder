const express = require('express');

const app = express();

// app.use((req,res)=>{
//     res.send('Hello from server..!');
// });

app.use('/home',(req,res)=>{
    res.send("Hello from route homes..!");
});

app.listen(3000,()=>{
    console.log('server listening on port 3000');
});
