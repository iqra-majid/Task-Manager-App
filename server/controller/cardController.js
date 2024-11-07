// controller/cardController.js
import Card from "../models/Card.js";

export const createCard = async (req, res) => {
  const { title, description, listId, dueDate, newPosition } = req.body;

  try {
    // Create a new card
    const newCard = new Card({
      list: listId,
      title: title || null,
      description: description || null,
      dueDate: dueDate || null,
      position: newPosition || 0,
    });
    await newCard.save();

    res.status(201).json({ success: true, card: newCard });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ success: false, error: "Failed to create card" });
  }
};

export const getCards = async (req, res) => {
  const { listId } = req.body;

  try {
    const cards = await Card.find({ list: listId }); // Find cards associated with the list
    res.status(200).json({ success: true, cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ success: false, error: "Unable to fetch cards" });
  }
};

export const updateCardPosition = async (req, res) => {
  const { cardId, newListId, newPosition } = req.body;
  try {
    // Find the card to move
    const card = await Card.findById(cardId);

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    // Check if card.listId is defined
    if (!card.list) {
      return res
        .status(400)
        .json({ success: false, message: "Card has no listId" });
    }

    // Convert card.list to string for comparison
    const cardListId = card.list.toString();

    // If the list has changed, update the card's list ID and reorder positions in both lists
    if (cardListId !== newListId) {
      // Update positions in the original list
      await Card.updateMany(
        { list: card.list, position: { $gt: card.position } },
        { $inc: { position: -1 } }
      );

      // Update positions in the new list
      await Card.updateMany(
        { list: newListId, position: { $gte: newPosition } },
        { $inc: { position: 1 } }
      );

      // Move the card to the new list and update its position
      card.list = newListId;
      card.position = newPosition;
    } else {
      // Within the same list: reorder positions
      if (newPosition < card.position) {
        await Card.updateMany(
          {
            list: card.list,
            position: { $gte: newPosition, $lt: card.position },
          },
          { $inc: { position: 1 } }
        );
      } else if (newPosition > card.position) {
        await Card.updateMany(
          {
            list: card.list,
            position: { $gt: card.position, $lte: newPosition },
          },
          { $inc: { position: -1 } }
        );
      }

      card.position = newPosition;
    }

    // Save the updated card
    await card.save();

    res.json({ success: true, message: "Card position updated successfully" });
  } catch (error) {
    console.error("Error updating card position:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCard = async (req, res) => {
  const { cardId, title, description, assignedUserId, dueDate, stage } =
    req.body;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ success: false, error: "Card not found" });
    }

    // Update card fields if they are provided
    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = description;
    if (dueDate !== undefined) card.dueDate = dueDate;
    if (assignedUserId !== undefined) card.assignedUser = assignedUserId;
    if (req.user._id) card.createdBy = req.user._id;
    if (stage !== undefined) card.stage = stage;

    // Save the updated card
    await card.save();

    res.status(200).json({ success: true, card });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ success: false, error: "Failed to update card" });
  }
};

export const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    // Find and delete the card by its ID
    const deletedCard = await Card.findByIdAndDelete(cardId);

    if (!deletedCard) {
      return res.status(404).json({ success: false, error: "Card not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ success: false, error: "Failed to delete card" });
  }
};
