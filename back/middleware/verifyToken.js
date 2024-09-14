const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const verifyToken = (req, res, next) => {
    const token = req.cookies.user || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.role = decoded.role; // Store the role in the request for further use
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token has expired" });
        }
        res.status(500).json({ error: "An error occurred while verifying the token" });
    }
};

const onlyForAdmin = (req, res, next) => {
    if (req.role !== 'Admin') {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

const onlyForTeacher = (req, res, next) => {
    if (req.role !== 'Teacher') {
        return res.status(403).json({ error: "Access denied. Teachers only." });
    }
    next(); // Continue to the next middleware if the role is Teacher
};

const onlyForStudent = (req, res, next) => {
    if (req.role !== 'Student') {
        return res.status(403).json({ error: "Access denied. Students only." });
    }
    next(); // Continue to the next middleware if the role is Student
};

module.exports = {
    verifyToken,
    onlyForAdmin,
    onlyForStudent,
    onlyForTeacher
};
