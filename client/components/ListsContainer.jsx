import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CardModal from "./CardModal";

const ListsContainer = ({ boardId, lists }) => {
  const [openAddCard, setOpenAddCard] = useState({});
  const [cardTitle, setCardTitle] = useState({});
  const [cardLists, setCardLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [originalCardPosition, setOriginalCardPosition] = useState(null); // Track original position

  const fetchCardLists = async (listId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cards/getCards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ listId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.success) {
        setCardLists((prev) => ({ ...prev, [listId]: data.cards || [] }));
      } else {
        console.warn("No cards found in the response:", data);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    lists.forEach((list) => {
      fetchCardLists(list._id);
    });
  }, [lists]);

  const handleDelete = async (cardId) => {
    console.log(cardId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/cards/deleteCard/${cardId}`, // The endpoint for deleting a card
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the card");
      }

      console.log("Card deleted successfully");
      setCardLists((prevCards) => {
        const newCardLists = { ...prevCards }; // Make a shallow copy of the current card lists

        Object.keys(newCardLists).forEach((listId) => {
          newCardLists[listId] = newCardLists[listId].filter(
            (card) => card._id !== cardId
          );
        });

        return newCardLists; // Return the updated card lists
      });
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const addCard = async (listId) => {
    if (!cardTitle[listId]) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/cards/createCard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title: cardTitle[listId], listId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        fetchCardLists(listId);
        setCardTitle((prev) => ({ ...prev, [listId]: "" }));
        setOpenAddCard((prev) => ({ ...prev, [listId]: false }));
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const toggleAddCard = (listId) => {
    setOpenAddCard((prev) => ({ ...prev, [listId]: !prev[listId] }));
    if (!openAddCard[listId]) {
      fetchCardLists(listId);
    }
  };

  const onDragStart = (start) => {
    // Store the original position of the card being dragged
    const { draggableId, source } = start;
    const originalListId = source.droppableId;
    const originalIndex = source.index;

    setOriginalCardPosition({ draggableId, originalListId, originalIndex });
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    // If dropped outside of a droppable area
    if (!destination) {
      return; // Card remains in original position
    }

    // If the item was dropped in the same location
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // No movement, no need to update state
    }

    // Prevent dropping on the button or title area
    if (destination.droppableId === "buttonArea") {
      return; // Card remains in original position
    }

    // Move the card from one list to another or reorder within the same list
    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;

    const cardToMove = cardLists[sourceListId][source.index];

    // Update card lists state
    setCardLists((prev) => {
      const sourceList = [...prev[sourceListId]];
      const destinationList = [...(prev[destinationListId] || [])];

      // Remove the card from the source list
      sourceList.splice(source.index, 1);

      // Add the card to the destination list
      destinationList.splice(destination.index, 0, cardToMove);

      return {
        ...prev,
        [sourceListId]: sourceList,
        [destinationListId]: destinationList,
      };
    });

    // Send updated position to the backend
    try {
      const response = await fetch(
        `http://localhost:8080/api/cards/updateCardPosition`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            cardId: cardToMove._id,
            newListId: destinationListId,
            newPosition: destination.index,
          }),
        }
      );
    } catch (error) {
      console.error("Error updating card position:", error);
    }
  };

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Droppable droppableId="droppableLists" direction="horizontal">
        {(provided) => (
          <div
            className="flex space-x-4 flex-wrap w-full space-y-4"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {lists.map((list) => (
              <Droppable key={list._id} droppableId={list._id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-[#00acdca2] w-64 flex-shrink-0 rounded-xl shadow-md px-5 py-5 cursor-pointer"
                  >
                    {/* Title area as a Droppable */}
                    <Droppable droppableId={`title-${list._id}`} type="TITLE">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="font-bold"
                        >
                          {list.title}
                          {provided.placeholder}{" "}
                        </div>
                      )}
                    </Droppable>

                    <div>
                      {cardLists[list._id]?.map((card, index) => (
                        <Draggable
                          key={card._id}
                          draggableId={card._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex justify-between border-2 border-gray-500 hover:border-gray-700 rounded-xl px-2 py-2 mt-3 cursor-pointer transition duration-150 ease-in-out"
                            >
                              <p className="text-lg font-semibold">
                                {card.title}
                              </p>
                              <p onClick={() => openModal(card)}>edit</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}{" "}
                      <CardModal
                        isOpen={isModalOpen}
                        card={selectedCard}
                        onClose={closeModal}
                        handleDelete={handleDelete}
                      />
                    </div>

                    {/* Button area as a Droppable */}
                    <Droppable droppableId={`button-${list._id}`} type="BUTTON">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {!openAddCard[list._id] ? (
                            <button
                              onClick={() => toggleAddCard(list._id)}
                              className="mt-3 hover:bg-gray-300 px-3 w-full py-3 rounded-xl transition"
                            >
                              + Add a Card
                            </button>
                          ) : (
                            <div className="bg-[#5dcae9] w-full mt-3 p-5 rounded-md">
                              <h2 className="text-xl font-semibold mb-4">
                                Add New Card
                              </h2>
                              <input
                                type="text"
                                placeholder="Card Title"
                                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                value={cardTitle[list._id] || ""}
                                onChange={(e) =>
                                  setCardTitle((prev) => ({
                                    ...prev,
                                    [list._id]: e.target.value,
                                  }))
                                }
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() =>
                                    setOpenAddCard((prev) => ({
                                      ...prev,
                                      [list._id]: false,
                                    }))
                                  }
                                  className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => addCard(list._id)}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                                >
                                  Add Card
                                </button>
                              </div>
                            </div>
                          )}
                          {provided.placeholder}{" "}
                          {/* Placeholder for the button area */}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Droppable>
            ))}
            {provided.placeholder}{" "}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListsContainer;
