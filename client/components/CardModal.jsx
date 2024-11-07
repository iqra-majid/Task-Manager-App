import React, { useEffect, useState } from "react";

const CardModal = ({ isOpen, card, onClose, handleDelete, user }) => {
  if (!isOpen) return null;

  const [description, setDescription] = useState(card?.description || "");
  const [dueDate, setDueDate] = useState(card?.dueDate || "");
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userOpen, setUserOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (card && card.assignedUser) {
        const body = {
          userId: card.assignedUser,
        };
        const response = await fetch(
          `http://localhost:8080/api/auth/fetchName`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(body),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const { name, email } = data;
          setName(name);
          setEmail(email);
        } else {
          console.error("Error fetching data");
        }

        setTitle(card.title || "");
        setDescription(card.description || "");
        setDueDate(card.dueDate || "");
      }
    };

    fetchCardDetails();
  }, [card]);

  const handleSave = async () => {
    try {
      const body = {
        listId: card.list,
        cardId: card._id,
      };

      if (title) {
        body.title = title;
      }
      if (description) {
        body.description = description;
      }
      if (dueDate) {
        body.dueDate = dueDate;
      }
      if (selectedUserId) {
        body.assignedUserId = selectedUserId;
      }
      if (selectedOption) {
        body.stage = selectedOption;
      }

      const response = await fetch(
        `http://localhost:8080/api/cards/updateCard`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Card saved successfully:", data);
      } else {
        console.error("Failed to save card:", data.error);
      }
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  const fetchUsers = async () => {
    setUserOpen(!userOpen);

    try {
      const response = await fetch("http://localhost:8080/api/auth/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5">
      <div className="relative bg-white p-6 rounded-lg shadow-sm ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">Card Details</h2>

        <p className="text-lg font-semibold mb-3">Edit </p>

        <div className="flex spcae-x-5">
          <div>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            {/* Description Input */}
            <textarea
              className="w-full mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Due Date Input */}
            <div className="mt-4">
              <label
                htmlFor="dueDate"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <select
                value={selectedOption}
                onChange={handleChange}
                className="mt-6 bg-blue-500 w-52 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
                <option value="upgrading">Upgrading</option>
              </select>
              <button
                onClick={fetchUsers}
                className="text-white bg-blue-500  w-60 rounded-xl h-10 mt-4 shadow-md px-5 py-2 cursor-pointer"
              >
                Assign a user
              </button>

              {userOpen && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Users List</h3>
                  <ul>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <li
                          onClick={() => handleUserClick(user._id)}
                          key={user._id}
                          className="mb-2 p-2 border border-gray-200 rounded"
                        >
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </li>
                      ))
                    ) : (
                      <p>No users available.</p>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="ml-20">
            <p className="font-bold text-lg mb-2">Assign user: {name}</p>
            <p>Email: {email}</p>
            <p className="mt-3 font-bold text-md">{card?.title}</p>
            <p className="w-72 mt-3">{card?.description}</p>
            <p className="text-md font-semibold mb-3 mt-2 text-red-700">
              {card?.dueDate && "Due Date: " + formatDate(card.dueDate)}
            </p>
            <p
              className={
                card?.stage === "pending"
                  ? "text-orange-500 font-bold"
                  : card?.stage === "done"
                  ? "text-green-500 font-bold"
                  : card?.stage === "upgrading"
                  ? "text-blue-500 font-bold"
                  : "text-black font-bold"
              }
            >
              {card?.stage}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 w-60 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Save
        </button>
        {user !== true && (
          <button
            onClick={() => handleDelete(card._id)}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CardModal;
