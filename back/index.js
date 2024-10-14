const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')


const {port,dbConnection}=require('./config/config')
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

let dbConnectionError = null;  // To store any DB connection error

const database = async () => {
  try {
    await mongoose.connect(dbConnection);
    console.log('Connected to the database successfully');
    
    app.listen(port, () => {
      console.log('Server is running on port 4000');
    });
  } catch (error) {
    dbConnectionError = error;  // Store the error
    console.error('Failed to connect to the database:', error.message || error.code);
  }
};

database();

app.get('/db-status', (req, res) => {
    if (dbConnectionError) {
      res.status(500).json({ error: dbConnectionError.message || 'Unknown database connection error' });
    } else {
      res.json({ message: 'Database is connected' });
    }
  });
  
app.use(UserRouter)
app.use('/class',ClassRouter)
app.use(TeacherSectionSubject)
app.use(TeacherRouter)
app.use(ScoreRoute)
app.use(SubjectRoute)
app.use(FamilyRouter)
app.use(StudentRouter)
app.use(CommonRouter)



