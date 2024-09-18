const bcrypt = require('bcrypt');

const {Family, Student} = require('../model/Student_Family.model')
const {Admin} = require('../model/user.model');
const {Teacher} = require('../model/Teacher.model');
const  generateTokenAndSetCookie = require('../utilities/generateTokenAndSetCookie');

const DeleteFamilyAndStudent = async (req, res) => {
    const { id } = req.params;

    if(!req.userId) return res.status(401).json({error:"UnAutherized"});
    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }

    try {
        // Try to delete from Family
        const deletedFamily = await Family.findByIdAndDelete(id);
        if (deletedFamily) {
            return res.status(200).json(deletedFamily);
        }

        // Try to delete from Student if Family not found
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (deletedStudent) {
            return res.status(200).json(deletedStudent);
        }
      
        // If none were deleted
        return res.status(404).json({ error: "No document found with this ID!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const userLogIn = async (req, res) => {
    const { userId, password} = req.body;

    try {
        const [admin, teacher, student, family] = await Promise.all([
            Admin.findOne({ userId }),
            Teacher.findOne({ userId }),
            Student.findOne({ userId }),
            Family.findOne({ userId })
        ]);

        const user = admin || teacher || student || family;
        if (!user) {
            return res.status(404).json({ error: "This user does not exist" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password!" });
        }

        const userPayload = {
            username: user.username || user.first || user.familyFirst,
            role: user.role,
            email: user.email,
            id: user._id
        };

        generateTokenAndSetCookie(res, user._id,user.role);

        res.status(200).json({ username: userPayload.username });
        
    } catch (error) {
        res.status(500).json({ error: "Something went wrong, please try again!" });
    }
};

const getUserDetails = async (req, res) => {
    try {
        // Extract the user ID from the request object
        const { userId } = req;

        // Search for the user in all collections
        const [admin, teacher, student, family] = await Promise.all([
            Admin.findById(userId).select('-password'), // Exclude sensitive fields
            Teacher.findById(userId).select('-password'),
            Student.findById(userId).select('-password'),
            Family.findById(userId).select('-password')
        ]);

        // Determine which user was found
        const user = admin || teacher || student || family;

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Send the user details as a response
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching user details" });
    }
};


const userLogOut = (req, res) => {
    // Clear the cookie by setting it to an empty value and setting maxAge to 0
    res.cookie("user", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'strict', // Helps prevent CSRF attacks
        expires: new Date(0) // Sets the cookie to expire immediately
    });
    res.status(200).json({ message: "Successfully logged out" });
};


module.exports = {
    DeleteFamilyAndStudent,
    getUserDetails,
    userLogOut,
    userLogIn
}