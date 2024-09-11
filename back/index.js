require("dotenv").config()
const express = require('express')
const cors = require('cors')
const UserRouter = require('./routes/user.router')
const ClassRouter = require('./routes/yearClass')
const TeacherSectionSubject = require('./routes/TeacherSectionSubect.router')
const TeacherRouter = require('./routes/Teacher.router')
const ScoreRoute = require('./routes/Score.route')
const SubjectRoute = require('./routes/Subject.router')
const StudentRouter = require('./routes/Student.router')
const FamilyRouter = require('./routes/Family.router')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));


const database = async () => {

    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Connected to the database successfully');
        
        app.listen(process.env.PORT, () => {
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
app.use('/class',ClassRouter)
app.use(TeacherSectionSubject)
app.use(TeacherRouter)
app.use(ScoreRoute)
app.use(SubjectRoute)
app.use(FamilyRouter)
app.use(StudentRouter)



