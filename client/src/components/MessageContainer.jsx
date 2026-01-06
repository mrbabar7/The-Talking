import React, { useEffect, useState, useRef } from "react";
import MessageSkeleton from "./MessageSkeleton";
import { useContext } from "react";
import { ChatContext } from "../provider/ChatProvider";
import { ProfileContext } from "../provider/profileProvider";
import { formatDate } from "../utils/dateTimeFormat";
import { MessageContext } from "../provider/MessageProvider";
import ReactionMenue from "./ReactionMenue";
import EmojiComp from "./EmojiPicker";
import DeleteComp from "./DeletePicker";
import ImageChat from "../partials/ImageChat";
import TextChat from "../partials/textChat";
import VoiceChat from "../partials/voiceChat";
const MessageContainer = () => {
  const { skelLoading, messages, selectedContact } = useContext(ChatContext);
  const {
    showMenu,
    setShowMenu,
    showEmoji,
    setShowEmoji,
    setActiveMessage,
    setMenuPosition,
    showDelete,
    setShowDelete,
  } = useContext(MessageContext);
  console.log("messages are coming");
  const { userProfile } = useContext(ProfileContext);
  const scrollView = useRef(null);

  const openMenu = (x, y, message) => {
    setActiveMessage(message);
    setMenuPosition({ x, y });
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setShowEmoji(false);
    setShowDelete(false);
    setActiveMessage(null);
  };

  useEffect(() => {
    const close = () => closeMenu();
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (scrollView.current && messages) {
      scrollView.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // playing start

  if (skelLoading) {
    return (
      <div className="h-full overflow-y-auto scrollbar-indigo py-4 md:px-10 px-4">
        <MessageSkeleton></MessageSkeleton>;
      </div>
    );
  }
  if (messages.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="text-indigo-900 font-md">No messages yet</span>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto  scrollbar-indigo py-4 md:px-10 px-4">
      {messages.map((message) => {
        if (message?.hidden) return null;

        const grouped = (message.reactions || []).reduce((acc, r) => {
          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
          return acc;
        }, {});
        const reactionEntries = Object.entries(grouped);

        return (
          <div key={message._id} className="my-2" ref={scrollView}>
            <div
              className={`chat relative ${
                String(message.senderId) === String(userProfile.userId)
                  ? "chat-end"
                  : "chat-start"
              } `}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src={`${
                      message.senderId === userProfile.userId
                        ? userProfile.profilePic ||
                          "https://res.cloudinary.com/dq3njqvjt/image/upload/v1767558291/chatty_users/i6pnlxizjtywcu0w57vj.webp"
                        : selectedContact.profilePic ||
                          "https://res.cloudinary.com/dq3njqvjt/image/upload/v1767558291/chatty_users/i6pnlxizjtywcu0w57vj.webp"
                    }`}
                  />
                </div>
              </div>
              {message.deletedForEveryone ? (
                <div className="italic text-gray-500 text-sm">
                  🚫 This message was deleted
                </div>
              ) : (
                <>
                  {message.image?.length > 0 && (
                    <ImageChat
                      message={message}
                      reactionEntries={reactionEntries}
                    ></ImageChat>
                  )}
                  {message.text && (
                    <TextChat
                      message={message}
                      reactionEntries={reactionEntries}
                    ></TextChat>
                  )}
                  {message?.audio && (
                    <VoiceChat
                      message={message}
                      reactionEntries={reactionEntries}
                    ></VoiceChat>
                  )}
                </>
              )}

              <div className="chat-footer opacity-50 flex gap-2 items-center">
                <time className="text-xs opacity-50">
                  {formatDate(message.createdAt)}
                </time>
              </div>
            </div>
          </div>
        );
      })}
      {showMenu && <ReactionMenue></ReactionMenue>}
      {showEmoji && <EmojiComp></EmojiComp>}
      {showDelete && <DeleteComp></DeleteComp>}
    </div>
  );
};

export default MessageContainer;
