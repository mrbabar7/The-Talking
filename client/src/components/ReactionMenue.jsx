import React, { useContext } from "react";
import { MessageContext } from "../provider/MessageProvider";
const ReactionMenue = () => {
  const { menuPosition, handleReactClick, handleDeleteClick } =
    useContext(MessageContext);
  return (
    <div
      className="fixed bg-white shadow-xl rounded-xl p-2 z-50 w-40"
      style={{
        top: menuPosition.y,
        left: menuPosition.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full text-left px-2 py-1 hover:bg-gray-100 text-black"
        onClick={handleReactClick}
      >
        React
      </button>
      <button
        className="w-full text-left px-2 py-1 hover:bg-gray-100 text-black"
        onClick={handleDeleteClick}
      >
        Delete
      </button>
    </div>
  );
};

export default ReactionMenue;
