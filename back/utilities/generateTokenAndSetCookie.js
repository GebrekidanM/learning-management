const { JWT_SECRET, nodeEnv } = require('../config/config');
const jwt=  require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId,role) => {
  try {
    const token = jwt.sign({ userId,role }, JWT_SECRET, { expiresIn: '3d' });

    const isProduction = nodeEnv === 'production';

    res.cookie("user", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });


    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

module.exports = generateTokenAndSetCookie
