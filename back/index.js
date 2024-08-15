require("dotenv").config()
const express = require('express')
const cors = require('cors')
const UserRouter = require('./routes/user')
const MemberRouter = require('./routes/memberregistration')
const ClassRouter = require('./routes/yearClass')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
mongoose.connect('mongodb://localhost:27017/tibeb').then(()=>{
    app.listen(4000, () => {
        console.log(`Server is running on port $4000`);
    });
});

app.use('/user',UserRouter)
app.use('/member', MemberRouter)
app.use('/class',ClassRouter)



