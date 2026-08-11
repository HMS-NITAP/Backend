const express = require('express');
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { signS3UrlsInResponses } = require('./middlewares/signedUrls');
const PORT = process.env.PORT || 4000;

// const {cloudinaryConnect} = require('./config/cloudinary');
// cloudinaryConnect();

app.use(express.json());
app.use(cookieParser());

const defaultAllowedOrigins = [
    "https://www.nitandhrahms.in",
    "http://localhost:5173",
];
const allowedOrigins = (process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : defaultAllowedOrigins);

app.use(
    cors({
        origin : (origin, callback) => {
            if(origin && allowedOrigins.includes(origin)){
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials:true,
    })
)

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(signS3UrlsInResponses);

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
