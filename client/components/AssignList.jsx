import React, { useState } from "react";
import CardModal from "./CardModal";

const AssignList = ({ lists, cards }) => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [assigned, setAssigned] = useState(false)
  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
    setAssigned(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };
  return (
    <div className="mx-10 my-10">
      {lists.map((list) => (
        <div
          key={list._id}
          className="bg-[#00acdca2] w-64 flex-shrink-0 rounded-xl shadow-md px-5 py-5 cursor-pointer"
        >
          <div className="font-bold">{list.title}</div>
          <div>
            {cards.map((card) => (
              <div
                key={card._id}
                className="flex justify-between border-2 border-gray-500 rounded-xl px-2 py-2 mt-3 cursor-pointer transition duration-150 ease-in-out"
              >
                <p className="text-lg font-semibold">{card.title}</p>
                <p onClick={() => openModal(card)}>edit</p>
              </div>
            ))}
            <CardModal
              isOpen={isModalOpen}
              card={selectedCard}
              onClose={closeModal}
              user={assigned}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignList;
