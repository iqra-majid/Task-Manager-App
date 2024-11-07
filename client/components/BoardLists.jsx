import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignBoards, setAssignBoards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/boards/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch boards");
        }

        const data = await response.json();
        setBoards(data.boards);
      } catch (error) {
        console.error("Error fetching boards:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAssignedBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/boards/assigned",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned boards");
        }

        const data = await response.json();

        setAssignBoards(data.boardsData);
        console.log(data.boardsData);
      } catch (error) {
        console.error("Error fetching assigned boards:", error);
      }
    };

    fetchAssignedBoards();

    fetchBoards();
  }, []);

  const handleBoardClick = (id) => {
    router.push(`/board/${id}`);
  };

  const handleAssignBoardClick = (id) => {
    router.push(`/assignBoard/${id}`);
  };

  return (
    <div className="">
      {boards.length === 0 ? (
        <div className="text-lg font-semibold text-gray-500">
          No boards found.
        </div>
      ) : (
        <div className="flex space-x-3">
          {boards.map((board) => (
            <div
              className="bg-[#00aedc] px-5 py-5 w-80 h-28 cursor-pointer shadow-sm hover:bg-[#00acdccf] rounded-xl"
              key={board._id}
              onClick={() => handleBoardClick(board._id)}
            >
              <div className="text-md font-bold mb-4">{board.title}</div>
            </div>
          ))}
        </div>
      )}
      <h4 className="text-lg font-bold mb-4 mt-16">My Assigned Boards </h4>

      {assignBoards.length === 0 ? (
        <div className="text-lg font-semibold text-gray-500">
          No boards found.
        </div>
      ) : (
        <div className="flex space-x-3">
          {assignBoards.map((boardData) => (
            <div
              className="bg-[#00aedc] px-5 py-5 w-80 h-28 cursor-pointer shadow-sm hover:bg-[#00acdccf] rounded-xl"
              key={boardData.board._id}
              onClick={() => handleAssignBoardClick(boardData.board._id)}
            >
              <div className="text-md font-bold mb-4">
                {boardData.board.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;
