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
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token has expired" });
        }
        res.status(500).json({ error: "An error occurred while verifying the token" });
    }
};

const onlyForAdmin = (req,res,next)=>{
    const token = req.cookies.user || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized! No token provided." });
    }
    try {
        if(token.role === 'Admin'){
            const decoded = jwt.verify(token, JWT_SECRET);
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token has expired" });
        }
        res.status(500).json({ error: "An error occurred while verifying the token" });        
    }
    
}

const onlyForTeacher = (req,res,next)=>{
    const token = req.cookies.user || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized! No token provided." });
    }
    try {
        if(token.role === 'Teacher'){
            const decoded = jwt.verify(token, JWT_SECRET);
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token has expired" });
        }
        res.status(500).json({ error: "An error occurred while verifying the token" });        
    }
    
}

const onlyForStudent = (req,res,next)=>{
    const token = req.cookies.user || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized! No token provided." });
    }
    try {
        if(token.role === 'Student'){
            const decoded = jwt.verify(token, JWT_SECRET);
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token has expired" });
        }
        res.status(500).json({ error: "An error occurred while verifying the token" });        
    }   
}


module.exports = {
    verifyToken,
    onlyForAdmin,
    onlyForStudent,
    onlyForTeacher
};
