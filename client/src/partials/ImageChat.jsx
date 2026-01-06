import { useContext } from "react";
import { MessageContext } from "../provider/MessageProvider";
import { ProfileContext } from "../provider/profileProvider";
import { Loader } from "lucide-react";
import Reactions from "./Reactions";
const ImageChat = ({ message, reactionEntries }) => {
  const { userProfile } = useContext(ProfileContext);
  const { handleRightClick, handleTouchStart, cancelTouch } =
    useContext(MessageContext);

  return (
    <div
      className={`relative flex flex-wrap gap-2.5 chat-header mb-2  ${
        message.senderId === userProfile.userId && "pb-5"
      } `}
      onContextMenu={(e) => handleRightClick(e, message)}
      onTouchStart={(e) => handleTouchStart(e, message)}
      onTouchEnd={cancelTouch}
      onTouchMove={cancelTouch}
    >
      {message.image.map((pic, index) => (
        <div
          key={index}
          className="relative md:size-32 size-25 overflow-hidden rounded-md"
        >
          <img src={pic} alt="chat-img" className="size-full object-cover" />
          {message.postStatus === "posting" && (
            <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center">
              <Loader className="animate-spin text-white" />
            </div>
          )}
        </div>
      ))}

      {message.senderId === userProfile.userId && (
        <span className="text-xs absolute bottom-0 right-1">
          {!message.delivered && "✔"}
          {message.delivered && !message.seen && (
            <span className="text-gray-500">✔✔</span>
          )}
          {message.seen && <span className="text-[#F709CB]">✔✔</span>}
        </span>
      )}
      {reactionEntries.length > 0 && (
        <Reactions message={message} reactionEntries={reactionEntries} />
      )}
    </div>
  );
};
export default ImageChat;
