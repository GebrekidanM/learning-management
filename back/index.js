require("dotenv").config()
const express = require('express')
const cors = require('cors')
const UserRouter = require('./routes/user.router')
const MemberRouter = require('./routes/memberregistration')
const ClassRouter = require('./routes/yearClass')
const TeacherSectionSubject = require('./routes/TeacherSectionSubect.router')
const TeacherRouter = require('./routes/Teacher.router')
const ScoreRoute = require('./routes/Score.route')
const SubjectRoute = require('./routes/Subject.router')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));


const database = async () => {

    try {
        await mongoose.connect(
            'mongodb+srv://nitsuhkidan:ESirak%4007%2C16@nitsuh.7d4nz.mongodb.net/tibeb?retryWrites=true&w=majority&appName=nitsuh'
        );
        console.log('Connected to the database successfully');
        
        app.listen(4000, () => {
            console.log('Server is running on port 4000');
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Exits the process with failure
    }
}

database();

/*
mongoose.connect('mongodb://localhost:27017/tibeb',()=>{
    app.listen(4000, () => {
        console.log('Server is running on port 4000');
    });
})
*/
app.use(UserRouter)
app.use('/member', MemberRouter)
app.use('/class',ClassRouter)
app.use(TeacherSectionSubject)
app.use(TeacherRouter)
app.use(ScoreRoute)
app.use(SubjectRoute)



