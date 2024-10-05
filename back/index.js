const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')


const {port,dbConnection}=require('./config/config')
const {verifyToken }= require('./middleware/verifyToken')
const app = express()

const UserRouter = require('./routes/user.router')
const ClassRouter = require('./routes/yearClass')
const TeacherSectionSubject = require('./routes/TeacherSectionSubect.router')
const TeacherRouter = require('./routes/Teacher.router')
const ScoreRoute = require('./routes/Score.route')
const SubjectRoute = require('./routes/Subject.router')
const StudentRouter = require('./routes/Student.router')
const FamilyRouter = require('./routes/Family.router')
const CommonRouter = require('./routes/common.route')

app.use(express.json())
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('public'));

const database = async () => {
    try {
        await mongoose.connect(dbConnection);
        console.log('Connected to the database successfully');
        
        app.listen(port, () => {
            console.log('Server is running on port 4000');
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}

database();

app.use(UserRouter)
app.use('/class',ClassRouter)
app.use(TeacherSectionSubject)
app.use(TeacherRouter)
app.use(ScoreRoute)
app.use(SubjectRoute)
app.use(FamilyRouter)
app.use(StudentRouter)
app.use(CommonRouter)



