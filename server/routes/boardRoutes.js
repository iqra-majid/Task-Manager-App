// routes/boardRoutes.js
import express from 'express';
import { createBoard, getBoards, getBoardById, getAssignBoards } from '../controller/boardController.js';
import fetchUser from './../middleware/authUser.js';

const router = express.Router();

// Define routes
router.post('/', fetchUser, createBoard); // Create a new board
router.get('/', fetchUser, getBoards); // Get all boards
router.get('/assigned', fetchUser, getAssignBoards); // Get assign boards
router.get('/:id', getBoardById); // Get single Board info

export default router;
