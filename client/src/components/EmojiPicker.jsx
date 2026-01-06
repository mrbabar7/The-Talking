import React from "react";
import EmojiPicker from "emoji-picker-react";
import { useContext } from "react";
import { MessageContext } from "../provider/MessageProvider";
const EmojiComp = () => {
  const { menuPosition, handleEmojiSelect } = useContext(MessageContext);

  return (
    <div
      className="fixed z-50 animate-scaleIn"
      style={{
        top: menuPosition.y,
        left: menuPosition.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <EmojiPicker onEmojiClick={handleEmojiSelect} height={350} width={300} />
    </div>
  );
};
export default EmojiComp;
