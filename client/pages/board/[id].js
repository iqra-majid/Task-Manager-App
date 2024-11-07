import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ListsContainer from "@/components/ListsContainer";

const BoardPage = () => {
  const [openAddList, setOpenAddList] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [lists, setLists] = useState([]);
  const [displayedLists, setDisplayedLists] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  const handleAddListClick = () => {
    setOpenAddList(!openAddList);
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/lists/${id}/getLists`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setLists(data.lists || []);
        setDisplayedLists(data.lists.slice(0, 5));
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    if (id) fetchLists();
  }, [id]);

  const addList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/lists/${id}/addList`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title: listTitle }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add list");
      }

      const data = await response.json();

      setLists((prevLists) => [...prevLists, data.list]);

      setListTitle("");
      setOpenAddList(false);
    } catch (error) {
      console.error("Error adding list:", error);
    }
  };

  const loadMore = () => {
    const currentDisplayLength = displayedLists.length;
    const nextItems = lists.slice(
      currentDisplayLength,
      currentDisplayLength + 5
    );

    if (nextItems.length === 0) {
      setHasMore(false);
    } else {
      setDisplayedLists((prevLists) => [...prevLists, ...nextItems]); // Append new lists
    }
  };

  return (
    <div className="mx-6 my-6 flex flex-col  space-y-5">
      <ListsContainer boardId={id} lists={displayedLists} />

      {/* "See More" button */}
      {hasMore && lists.length > 0 && (
        <div
          onClick={loadMore}
          className="text-white bg-blue-500 w-64 rounded-xl h-12 shadow-md px-5 py-2 cursor-pointer"
        >
          See More
        </div>
      )}

      {!openAddList ? (
        <div
          onClick={handleAddListClick}
          className="text-white bg-[#00acdca2] w-64 rounded-xl h-24 shadow-md px-5 py-5 cursor-pointer"
        >
          Create a List +
        </div>
      ) : (
        <div className="bg-white w-96 shadow-md p-5 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Add New List</h2>
          <input
            type="text"
            placeholder="List Title"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleAddListClick}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={addList}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default BoardPage;
