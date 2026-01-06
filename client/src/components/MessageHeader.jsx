import React, { useContext } from "react";
import { Phone, Video } from "lucide-react";
import { ChatContext } from "../provider/ChatProvider";
import { AuthContext } from "../provider/AuthProvider";
import { X } from "lucide-react";
const MessageHeader = () => {
  const { selectedContact, setHeader, typingUsers } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const isOnline = onlineUsers.includes(selectedContact.userId);
  return (
    <div className="flex flex-col justify-center items-center space-y-1">
      <div className="flex justify-between items-center shadow-md card-bg h-19 px-5 py-2 w-full">
        <div className="flex gap-3 items-center">
          <img
            src={
              selectedContact.profilePic ||
              "https://res.cloudinary.com/dq3njqvjt/image/upload/v1767558291/chatty_users/i6pnlxizjtywcu0w57vj.webp"
            }
            alt="img"
            className="size-14 rounded-full overflow-hidden object-cover"
          />
          <div>
            <p className="text-md font-md text-app">
              {selectedContact.userName}
            </p>
            {typingUsers[selectedContact.userId] ? (
              <span className="text-sm text-green-700">typing</span>
            ) : (
              <div>
                {isOnline ? (
                  <span className="text-sm accent">online</span>
                ) : (
                  <span className="text-sm accent">offline</span>
                )}
              </div>
            )}
          </div>
        </div>
        {/* <div className="flex items-center justify-center space-x-10 px-5">
          <Phone className="text-app size-5" />
          <Video className="text-app size-6" />
        </div> */}
      </div>
      <div className="md:hidden block">
        <button onClick={() => setHeader(false)}>
          <X className="text-app size-6" />
        </button>
      </div>
    </div>
  );
};

export default MessageHeader;
