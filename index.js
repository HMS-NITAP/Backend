const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin : "*",
        credentials:true,
    })
)

app.use("/api/v1",routes);

app.get("/",(_,res) => {
    return res.status(200).json({
        success:true,
        message:"Server is Running...",
    })
});

app.listen(PORT,() => {
    console.log(`App is Running at PORT ${PORT}`);
});



