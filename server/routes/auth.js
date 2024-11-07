import express from 'express';
import { signup, login, getAllusers,fetchName } from '../controller/authController.js';

const router = express.Router();

// Define login and signup routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/users' , getAllusers);
router.post('/fetchName' , fetchName);

export default router;
