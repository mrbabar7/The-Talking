import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../provider/ChatProvider";
import { AuthContext } from "../provider/AuthProvider";
import ContactsSkeleton from "./ContactsSkeleton";
import { dateFormat } from "../utils/dateTimeFormat";
const OnlineUserList = () => {
  const { onlineUsers } = useContext(AuthContext);
  const {
    setSelectedContact,
    contacts,
    selectedContact,
    setHeader,
    conversations,
  } = useContext(ChatContext);
  const onlineContacts = conversations.filter((contact) =>
    onlineUsers.includes(contact.userId)
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => setLoading(false);
  }, [contacts]);

  if (loading) {
    return <ContactsSkeleton></ContactsSkeleton>;
  }
  return (
    <>
      {onlineContacts.length === 0 ? (
        <div className="h-full flex justify-center items-center">
          <h1 className="text-indigo-900 md:p-10 p-7">No online users</h1>
        </div>
      ) : (
        <div className="h-full overflow-auto md:scrollbar-indigo scrollbar-fuck flex md:flex-col flex-row md:space-x-0 space-x-4 md:pb-0 pb-2">
          {onlineContacts.map((contact) => (
            <div
              key={contact.userId}
              className={`flex gap-3 items-center md:p-3 p-1 md:w-full md:h-auto w-20 h-20 hover:bg-blue-100 ${
                selectedContact?.userId === contact.userId &&
                "md:bg-blue-100 border-2 border-indigo-900 rounded-full md:border-0 md:rounded-none"
              } sm:justify-start justify-center `}
              disabled={selectedContact?.userId === contact.userId}
              onClick={() => {
                setSelectedContact({
                  userId: contact.userId,
                  profilePic: contact.profilePic,
                  userName: contact.userName,
                });
                setHeader(true);
              }}
            >
              <div className="flex rounded-full size-16  md:min-w-14 md:min-h-14  relative ">
                <img
                  src={contact.profilePic || "../src/assets/avatar.webp"}
                  alt="img"
                  className="rounded-full size-full overflow-hidden object-cover"
                />
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 flex-col space-y-2 items-start py-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p
                    className="text-sm text-indigo-900 font-semibold truncate"
                    title={contact.userName}
                  >
                    {contact.userName}
                  </p>
                  {contact.lastMessageAt && (
                    <span className="text-xs text-gray-700">
                      {dateFormat(contact.lastMessageAt)}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p
                    className="text-xs font-semibold truncate"
                    title={contact.lastMessage || "No messages yet"}
                  >
                    {contact.lastMessage || "No messages yet"}
                  </p>
                  {contact?.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2">
                      {contact?.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default OnlineUserList;
