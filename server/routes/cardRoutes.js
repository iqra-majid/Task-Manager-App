// routes/cardRoutes.js
import express from "express";
import {
  createCard,
  getCards,
  updateCardPosition,
  updateCard,
  deleteCard,
} from "../controller/cardController.js";
import fetchUser from "./../middleware/authUser.js"; // Ensure user is authenticated

const router = express.Router();

router.post("/createCard", fetchUser, createCard);
router.post("/getCards", fetchUser, getCards);
router.post("/updateCardPosition", fetchUser, updateCardPosition);
router.put("/updateCard", fetchUser, updateCard);
router.delete("/deleteCard/:cardId", fetchUser, deleteCard);

export default router;
