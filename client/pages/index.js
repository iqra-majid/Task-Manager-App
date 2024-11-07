import BoardList from "@/components/BoardLists";
import React, { useEffect, useState } from "react";

const Index = () => {

  return (
    <div className="mx-10 my-10">
      <h4 className="text-md font-bold mb-4">YOUR WORKSPACES</h4>
      <BoardList />
    </div>
  );
};

export default Index;
