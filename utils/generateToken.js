// utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },              // payload — the data embedded in the token
    process.env.JWT_SECRET,      // secret key used to create the signature
    { expiresIn: '1d' }           // token becomes invalid after 1 day
  );
};

export default generateToken;
