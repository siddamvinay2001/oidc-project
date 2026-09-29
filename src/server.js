import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();

app.get('/', (req,res)=>{
    res.json({
        message: "HELLO"
    })
})

app.listen(PORT, ()=>{
    console.log("Server is running at: " + PORT);
})
