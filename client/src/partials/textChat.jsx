import { useContext } from "react";
import { MessageContext } from "../provider/MessageProvider";
import { ProfileContext } from "../provider/profileProvider";
import { Loader } from "lucide-react";
import Reactions from "./Reactions";
const TextChat = ({ message, reactionEntries }) => {
  const { userProfile } = useContext(ProfileContext);
  const { handleRightClick, handleTouchStart, cancelTouch } =
    useContext(MessageContext);

  return (
    <div className="chat-bubble relative ">
      <div
        className={`  ${message.senderId === userProfile.userId && "pb-4"} `}
        onContextMenu={(e) => handleRightClick(e, message)}
        onTouchStart={(e) => handleTouchStart(e, message)}
        onTouchEnd={cancelTouch}
        onTouchMove={cancelTouch}
      >
        {message.text}
        {message.senderId === userProfile.userId && (
          <span className="text-xs absolute bottom-0 right-1">
            {!message.delivered && "✔"}
            {message.delivered && !message.seen && (
              <span className="text-gray-500">✔✔</span>
            )}
            {message.seen && <span className="text-[#F709CB]">✔✔</span>}
          </span>
        )}
      </div>
      {reactionEntries.length > 0 && (
        <Reactions message={message} reactionEntries={reactionEntries} />
      )}
    </div>
  );
};
export default TextChat;
