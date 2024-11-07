import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [boardName, setBoardName] = useState("");

  const handleClick = () => {
    setOpen(!open);
  };

  const onClose = () => {
    setOpen(!open);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Board Name:", boardName);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/api/boards/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: boardName }),
      });
      if (!response.ok) {
        throw new Error("Failed to create board");
      }
      const data = await response.json();
      console.log("Board created successfully:", data);
    } catch (error) {
      console.error("Error creating board:", error);
    }
    setBoardName("");
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("userEmail");

    window.location.href = "/login";
  };

  return (
    <>
      <div className="px-20 py-2 shadow-md bg-white">
        <div className="flex space-x-3 justify-between">
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-[#73abcd] hover:bg-[#87c8f1] rounded-xl w-40 transition duration-200"
          >
            {open ? "Close Board" : "Create a Board"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#73abcd] hover:bg-[#87c8f1] rounded-xl w-40 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col items-center justify-center space-y-2 px-5 py-5 shadow-md bg-white rounded-lg border border-gray-300 mt-2 w-[500px] mx-auto">
          <div className="flex justify-between items-center ">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Board Title
            </h2>
            <button
              onClick={onClose}
              className=" text-gray-700 hover:text-gray-900 cursor-pointer ml-16 mb-2"
            >
              X
            </button>
          </div>

          <div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center justify-center"
            >
              <input
                id="boardName"
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Board Name"
                className="mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-[#87c8f1] hover:bg-[#73abcd] rounded transition duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
