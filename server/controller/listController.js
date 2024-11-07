import List from "../models/List.js";
import Board from "../models/Board.js";
import Card from "../models/Card.js";

export const createList = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;

  try {
    // Check if the board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Create the list with a reference to the board
    const newList = new List({
      title,
      board: boardId,
      cards: [],
    });

    // Save the list and update the board with this new list
    await newList.save();

    board.lists.push(newList._id); // Add list to the board's lists array
    await board.save();

    res.status(201).json({ success: true, list: newList });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ error: "Failed to create list" });
  }
};

export const getLists = async (req, res) => {
  const { boardId } = req.params;

  try {
    const lists = await List.find({ board: boardId });
    res.status(200).json({ success: true, lists });
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ success: false, error: "Unable to fetch lists" });
  }
};

const getListsAndCards = async (boardId, userId) => {
  try {
    // Step 1: Get all lists for the given board
    const cards = await Card.find({ assignedUser: userId });

    let lists = [];

    for (let card of cards) {
      const list = await List.findById(card.list); // Fetch the list for the card
      lists.push(list); // Push the fetched list to the `lists` array
    }
    const responseData = { lists, cards };

    return responseData;
  } catch (error) {
    console.error("Error fetching lists and cards:", error);
    throw error;
  }
};

export const getAssignLists = async (req, res) => {
  const { boardId } = req.params; 
  const userId = req.user._id; 

  try {
    const { lists, cards } = await getListsAndCards(boardId, userId);

    res.status(200).json({ lists, cards });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lists and cards" });
  }
};
