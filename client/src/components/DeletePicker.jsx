import React from "react";
import EmojiPicker from "emoji-picker-react";
import { useContext } from "react";
import { MessageContext } from "../provider/MessageProvider";
import { ProfileContext } from "../provider/profileProvider";
const DeleteComp = () => {
  const {
    menuPosition,
    handleDeleteForMe,
    handleDeleteForEveryone,
    activeMessage,
  } = useContext(MessageContext);
  const { userProfile } = useContext(ProfileContext);
  return (
    <div
      className="animate-scaleIn fixed bg-white shadow-xl rounded-xl p-2 z-50 w-50"
      style={{
        top: menuPosition.y,
        left: menuPosition.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {activeMessage.senderId === userProfile.userId ? (
        <div>
          <button onClick={handleDeleteForMe}>Delete for me</button>
          <button className="text-red-600" onClick={handleDeleteForEveryone}>
            Delete for everyone
          </button>
        </div>
      ) : (
        <button onClick={handleDeleteForMe}>Delete</button>
      )}
    </div>
  );
};
export default DeleteComp;
