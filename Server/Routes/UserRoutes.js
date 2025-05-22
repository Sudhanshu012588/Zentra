import express from 'express';
import { signup,login,verification,veriifyRefreshToken } from '../Controllers/Auth.js';
import {uploadProfileImage,uploadCoverImage} from "../Controllers/ImageUplaod.js"
import {verifyRefreshToken} from "../Middlewares/VerifyToken.js"
const router = express.Router();

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify',verification)
router.post('/upload/profile',uploadProfileImage)
router.post('/upload/cover',uploadCoverImage)
router.get('/verifyrefreshtoken',verifyRefreshToken,veriifyRefreshToken)
export default router; 