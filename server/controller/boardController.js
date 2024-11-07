import Board from "../models/Board.js";
import Card from "../models/Card.js";

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const owner = req.user._id;

    // Create a new board instance
    const board = new Board({
      title,
      owner,
      lists: [],
    });

    // Save the board to the db
    await board.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ success: false, error: "Failed to create board." });
  }
};

// Get all boards
export const getBoards = async (req, res) => {
  const owner = req.user._id;
  try {
    const boards = await Board.find({ owner }).populate("owner", "username");

    res.status(200).json({ success: true, boards });
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ success: false, error: "Failed to fetch boards." });
  }
};

// Get single Board info

export const getBoardById = async (req, res) => {
  const { id } = req.params;

  try {
    const board = await Board.findById(id).populate("owner", "username"); // Find board and populate owner
    if (!board) {
      return res
        .status(404)
        .json({ success: false, error: "Board not found." });
    }
    res.status(200).json({ success: true, board });
  } catch (error) {
    console.error("Error fetching board:", error);
    res.status(500).json({ success: false, error: "Failed to fetch board." });
  }
};

export const getAssignBoards = async (req, res) => {
  const userId = req.user._id;
  try {
    const assignedCards = await Card.find({ assignedUser: userId })
      .populate("list")
      .populate("createdBy");

    const boardsData = [];

    for (const card of assignedCards) {
      const list = card.list;

      const board = await Board.findById(list.board);

      boardsData.push({
        board: board, // Board data
        list: list, // List data
        card: card, // Card data
      });
    }

    // Return the data to the client
    res.status(200).json({ boardsData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assigned boards" });
  }
};
