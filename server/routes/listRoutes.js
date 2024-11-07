import express from "express";
import { createList, getLists, getAssignLists } from "../controller/listController.js";
import fetchUser from "./../middleware/authUser.js";

const router = express.Router();

router.post("/:boardId/addList", fetchUser, createList);
router.get("/:boardId/getLists", fetchUser, getLists);
router.get("/:boardId/getAssignLists", fetchUser, getAssignLists);



export default router;
