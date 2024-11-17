const { default: mongoose } = require('mongoose');
const {Teacher} = require('../model/Teacher.model')
const {TeacherSectionSubject} = require('../model/TeacherSectionSubject.model')
const {Year} = require('../model/YearModel')
const {Section} = require('../model/YearModel')
const { Score } = require("../model/Score.model")
const generateId = require('../utilities/GenerateId')
const bcrypt = require('bcrypt');

function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function Password(name){
    return name + '@011';
}
//for fired teacher

const FiredTeacher = async (req, res) => {
    const { teacherId } = req.body;
    if(!req.userId) return res.status(401).json({error:"Un Autherized"});

    try {
        // Mark the teacher as inactive
        const teacher = await Teacher.findByIdAndUpdate(teacherId, { isActive: false }, { new: true });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Update all their assignments by setting an endDate
        await TeacherSectionSubject.updateMany(
            { teacherId, endDate: { $exists: false } }, // looking for the same teacherId and endDate:null or endDate:false in teahersectionsubject 
            { endDate: new Date() }
        );

        res.status(200).json({ message: 'Teacher marked as inactive and assignments updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const CreatingATeacher = async (req, res) => {
    const {first, middle, last, gender, age, region, city, subCity, wereda, houseNo, yearId,yearName , experience, email, phoneNo} = req.body;
    const teacherPhoto = req.file.filename 


    const { userId } = req;

    if(!userId) {return res.status(401).json({error:"Un Autherized"});}

    const password= Password(capitalizeFirstLetter(first))
    const role = "Teacher"
    const UserId = generateId(yearName,role)

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const student = await Teacher.create({first:capitalizeFirstLetter(first), middle:capitalizeFirstLetter(middle), last:capitalizeFirstLetter(last), password:hashedPassword,gender, age, region, city, subCity, userId:UserId, wereda, houseNo, yearId , experience, email, phoneNo,teacherPhoto})
        if(student){
            res.status(200).json(student)
        }else{
            res.status(400).json({error:"Something is wrong!"})
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: validationErrors });
        }
        res.status(500).json({ error: error.message });
    }
}

const GetOneTeacher = async(req,res)=>{
    const {teacherId} = req.params
    if(!mongoose.Types.ObjectId.isValid(teacherId)){
        return res.status(404).json({error:"Invalid Id!"})
    }
    try {
        const teacher = await Teacher.findById({_id:teacherId})
                                      .populate('yearId')
                                      .populate({
                                        path: 'homeTeacher',
                                        populate: {
                                            path: 'gradeId',
                                        }
                                    })
        if(!teacher){
            return res.status(404).json({error:"a Teacher with this id isnot found!"})
        }
        res.status(200).json(teacher)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const GetAllTeachers = async (req, res) => {
    try {
        const { isActive, search } = req.query;

        // Get today's date
        const today = new Date();

        // Find the current year based on today's date
        const currentYear = await Year.findOne({
            startPoint: { $lte: today },
            endPoint: { $gte: today }
        });

        if (!currentYear) {
            return res.status(404).json({ error: "No active year found for today's date." });
        }

        // Build the filter query
        let filter = { yearId: currentYear._id };

        if (isActive) {
            filter.isActive = isActive === 'true'; // Convert string to boolean
        }

        // Find teachers with optional search query
        let teachers = await Teacher.find(filter);

        if (search) {
            const query = search.toLowerCase();
            teachers = teachers.filter(teacher => 
                `${teacher.first} ${teacher.middle}`.toLowerCase().includes(query)
            );
        }

        if (teachers.length > 0) {
            res.status(200).json(teachers);
        } else {
            res.status(404).json({ error: 'No teachers found.' });
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: validationErrors });
        }
        res.status(500).json({ error: error.message });
    }
}

const UpdateTeaacher = async (req, res) => {
    const { teacherId } = req.params;
    const updates = req.body;
    if(!req.userId) return res.status(401).json({error:"Un Autherized"});

    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }
    if (req.file) {
        updates.teacherPhoto = req.file.filename; 
    }

    if(updates?.first){
        updates.first=capitalizeFirstLetter(updates.first)
    }
    if(updates?.middle){
        updates.middle=capitalizeFirstLetter(updates.middle)
    }
    
    if(updates?.last){
        updates.last=capitalizeFirstLetter(updates.last)
    }

    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, updates, { new: true, runValidators: true });
        if (!updatedTeacher) {
            return res.status(404).json({ error: 'Teacher not found!' });
        }
        res.status(200).json(updatedTeacher);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: validationErrors });
        }
        res.status(500).json({ error: error.message });
    }
}
const getAllTeachersNumber = async (req, res) => {
    try {
      const totalTeachers = await Teacher.countDocuments();
      if (totalTeachers === 0) {
        return res.status(404).json({ error: "No Teachers found" });
      }
      return res.status(200).json(totalTeachers);
    } catch (error) {
      return res.status(500).json({ error: 'Error retrieving total number of Teachers' });
    }
}

const addHomeClassToATeacher =  async (req, res) => {
    const { id } = req.params;
    const { homeClass } = req.body;
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }
    try {
      const sectionExists = await Section.findById(homeClass);
      if (!sectionExists) {
        return res.status(404).json({ error: 'Section not found' });
      }
      const teacher = await Teacher.find({homeTeacher: homeClass});
      if(teacher.length > 0){
        console.log(teacher)
        return res.status(400).json({error: "This Class already has home teacher!"})
      }

      const updatedTeacher = await Teacher.findByIdAndUpdate(
        id,
        { homeTeacher: homeClass },
        { new: true }
      );
  
      if (!updatedTeacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
  
      res.json({ message: 'Home class updated successfully', teacher: updatedTeacher });
    } catch (error) {
      res.status(500).json({ error: 'Failed to set home class' });
    }
  }
const getHomeClassOfATeacher = async (req,res)=>{
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }
    try {
        const teacher = await Teacher.findOne({_id:id}).populate({
                                                                    path: 'homeTeacher',
                                                                    populate: {
                                                                        path: 'gradeId',
                                                                    }
                                                                })
        if(!teacher){
            return res.status(404).json({error: "No teacher with this Id!"})
        }else{
            console.log(teacher.homeTeacher._id)
            const results = await Score.aggregate([
                // Match scores for the specified class
                { $match: { sectionId: new mongoose.Types.ObjectId(teacher.homeTeacher._id) } },
          
                // Group by student and subject, summing their scores
                {
                  $group: {
                    _id: {
                      student: '$studentId',
                      subject: '$subjectId',
                    },
                    totalScore: { $sum: '$value' },
                    totalOutOf: { $sum: '$outOf' },
                  },
                },
          
                // Lookup student and subject details
                {
                  $lookup: {
                    from: 'students',
                    localField: '_id.student',
                    foreignField: '_id',
                    as: 'studentDetails',
                  },
                },
                {
                  $lookup: {
                    from: 'subjects',
                    localField: '_id.subject',
                    foreignField: '_id',
                    as: 'subjectDetails',
                  },
                },
          
                // Unwind arrays to simplify structure
                { $unwind: '$studentDetails' },
                { $unwind: '$subjectDetails' },
          
                // Project the final output
                {
                  $project: {
                    student: {
                      id: '$studentDetails._id',
                      firstName: '$studentDetails.firstName',
                      lastName: '$studentDetails.lastName',
                    },
                    subject: {
                      id: '$subjectDetails._id',
                      name: '$subjectDetails.name',
                      shortCode: '$subjectDetails.shortCode',
                    },
                    totalScore: 1,
                    totalOutOf: 1,
                  },
                },
          
                // Group by student to aggregate all subjects and their total scores
                {
                  $group: {
                    _id: '$student.id',
                    name: { $first: { $concat: ['$student.firstName', ' ', '$student.lastName'] } },
                    subjects: {
                      $push: {
                        subject: '$subject.name',
                        shortCode: '$subject.shortCode',
                        score: '$totalScore',
                        outOf: '$totalOutOf',
                      },
                    },
                    totalScore: { $sum: '$totalScore' },
                    totalOutOf: { $sum: '$totalOutOf' },
                  },
                },
          
                // Optionally, sort by total score for ranking
                { $sort: { totalScore: -1 } },
          
                // Add rank field
                {
                  $setWindowFields: {
                    sortBy: { totalScore: -1 },
                    output: {
                      rank: { $rank: {} },
                    },
                  },
                },
          
                // Project final output
                {
                  $project: {
                    student: 1,
                    subjects: 1,
                    totalScore: 1,
                    totalOutOf: 1,
                    average: { $divide: ['$totalScore', '$subjects.length'] },
                    rank: 1,
                  },
                },
              ]);
          
              if (!results.length) {
                return res.status(404).json({ message: 'No scores found for this class.' });
              }
          
              res.status(200).json(results);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Server Error!"})
    }

}

module.exports = {
    FiredTeacher,
    CreatingATeacher,
    GetOneTeacher,
    GetAllTeachers,
    UpdateTeaacher,
    getAllTeachersNumber,
    addHomeClassToATeacher,
    getHomeClassOfATeacher}



