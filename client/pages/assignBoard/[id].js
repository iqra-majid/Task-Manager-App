import AssignList from "@/components/AssignList";
import ListsContainer from "@/components/ListsContainer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AssignBoardPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [cards, setCards] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/lists/${id}/getAssignLists`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);

        setLists(data.lists || []);
        setCards(data.cards || []);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    if (id) fetchLists();
  }, [id]);

  useEffect(() => {
    console.log(lists);
  }, [lists]);

  return (
    <div>
      <AssignList lists={lists} cards={cards} />
    </div>
  );
};

export default AssignBoardPage;
