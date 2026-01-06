import { createContext, useState, useRef, useEffect } from "react";
export const MessageContext = createContext({});
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { ChatContext } from "./ChatProvider";
import { ProfileContext } from "./profileProvider";
const MessageProvider = ({ children }) => {
  const { socket } = useContext(AuthContext);
  const { userProfile } = useContext(ProfileContext);
  const { setMessages } = useContext(ChatContext);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [activeMessage, setActiveMessage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const longPressTimer = useRef(null);

  const handleReactClick = () => {
    console.log("React clicked on message:", activeMessage);
    setShowMenu(false);
    setTimeout(() => setShowEmoji(true), 150);
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked on message:", activeMessage);
    setShowMenu(false);
    setShowDelete(true);
  };

  const handleEmojiSelect = (emoji) => {
    if (!activeMessage) return;

    // 🔴 emit to backend (real-time)
    socket.emit("reactMessage", {
      messageId: activeMessage._id,
      emoji: emoji.emoji,
    });

    setShowEmoji(false);
    setActiveMessage(null);
  };

  useEffect(() => {
    if (!socket) return;

    const handleReaction = ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, reactions } : m))
      );
    };

    socket.on("messageReaction", handleReaction);

    return () => socket.off("messageReaction", handleReaction);
  }, [socket]);

  const handleDeleteForMe = () => {
    socket.emit("deleteMessage", {
      messageId: activeMessage._id,
      type: "me",
    });

    setShowDelete(false);
    setActiveMessage(null);
  };

  const handleDeleteForEveryone = () => {
    socket.emit("deleteMessage", {
      messageId: activeMessage._id,
      type: "everyone",
    });

    setShowDelete(false);
    setActiveMessage(null);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("messageDeleted", ({ messageId, type, userId }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id !== messageId) return m;

          if (type === "me") {
            if (userId === userProfile.userId) {
              return { ...m, hidden: true };
            }
          }

          if (type === "everyone") {
            return {
              ...m,
              deletedForEveryone: true,
              text: "",
              image: [],
            };
          }

          return m;
        })
      );
    });

    return () => socket.off("messageDeleted");
  }, [socket]);

  const openMenu = (x, y, message) => {
    setActiveMessage(message);
    setMenuPosition({ x, y });
    setShowMenu(true);
  };
  const handleRightClick = (e, message) => {
    e.preventDefault();
    openMenu(e.clientX, e.clientY, message);
  };

  const handleTouchStart = (e, message) => {
    longPressTimer.current = setTimeout(() => {
      const touch = e.touches[0];
      openMenu(touch.clientX, touch.clientY, message);
      navigator.vibrate?.(20); // haptic feedback
    }, 500);
  };

  const cancelTouch = () => {
    clearTimeout(longPressTimer.current);
  };

  return (
    <MessageContext.Provider
      value={{
        showMenu,
        menuPosition,
        activeMessage,
        handleReactClick,
        handleDeleteClick,
        longPressTimer,
        setShowMenu,
        setActiveMessage,
        setMenuPosition,
        showEmoji,
        setShowEmoji,
        handleEmojiSelect,
        showDelete,
        setShowDelete,
        handleDeleteForMe,
        handleDeleteForEveryone,
        handleRightClick,
        handleTouchStart,
        cancelTouch,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
