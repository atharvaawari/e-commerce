import jwt from 'jsonwebtoken';
import { asyncHandler } from './asyncHandler.middleware.js';
import { User }  from '../models/user.module.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer", "");

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
    const user = await User.findById(decoded?._id).select('-password -refreshTokens');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
})