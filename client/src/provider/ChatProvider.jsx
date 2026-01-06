import { createContext, useState, useEffect, useRef, useMemo } from "react";
export const ChatContext = createContext({
  selectedContact: [],
  contacts: [],
  setSelectedContact: () => {},
  postMessage: () => {},
});
import {
  contactList,
  chatContact,
  getChatMessages,
  getConversations,
  voiceMessage,
} from "../services/chatService";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { ProfileContext } from "./profileProvider";
const ChatProvider = ({ children }) => {
  const { socket, userProfileId } = useContext(AuthContext);
  const { userProfile } = useContext(ProfileContext);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [skelLoading, setSkelLoading] = useState(false);
  const [contactsType, setContactsType] = useState("all");
  const [header, setHeader] = useState(true);
  const [typingUsers, setTypingUsers] = useState({});
  const hasEmittedSeenRef = useRef(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    console.log("contacts effet is running ");
    const fuckYou = async () => {
      try {
        const responce = await contactList();
        if (responce.err) {
          toast.error(responce.err || "Failed to load contacts");
          return;
        }

        setContacts(responce.contacts);
      } catch (err) {
        console.log("backend error:", err);
        toast.error("Unable to fetch contacts");
      }
    };
    fuckYou();
  }, []);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (err) {
        console.log("error loading conversations:", err);
        toast.error("Failed to load conversations");
      }
    };

    loadConversations();
  }, []);

  const conversationList = useMemo(() => {
    if (!contacts.length) return [];

    // 1️⃣ Build a map for quick lookup
    const contactMap = new Map(contacts.map((c) => [c.userId.toString(), c]));

    const usedContactIds = new Set();

    // 2️⃣ Active conversations FIRST (already ordered by backend or realtime)
    const activeChats = conversations
      .slice() // avoid mutation
      .sort((a, b) => {
        if (!a.lastMessageAt) return 1;
        if (!b.lastMessageAt) return -1;
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      })
      .map((convo) => {
        const contact = contactMap.get(convo.userId.toString());
        if (!contact) return null;

        usedContactIds.add(contact.userId.toString());

        return {
          userId: contact.userId,
          userName: contact.userName,
          profilePic: contact.profilePic,

          lastMessage: convo.lastMessage,
          lastMessageAt: convo.lastMessageAt,
          unreadCount: convo.unreadCount,

          hasChat: true,
        };
      })
      .filter(Boolean);

    // 3️⃣ Remaining contacts (NO CHAT YET)
    const newChats = contacts
      .filter((c) => !usedContactIds.has(c.userId.toString()))
      .map((contact) => ({
        userId: contact.userId,
        userName: contact.userName,
        profilePic: contact.profilePic,

        lastMessage: "Click to start Conversation",
        lastMessageAt: null,
        unreadCount: 0,

        hasChat: false,
      }));

    // 4️⃣ Merge → WhatsApp style
    return [...activeChats, ...newChats];
  }, [contacts, conversations]);

  useEffect(() => {
    const contactMessages = async () => {
      if (!socket || !selectedContact) {
        return;
      }
      setSkelLoading(true);
      try {
        const responce = await getChatMessages(selectedContact.userId);
        setMessages(responce.messages || []);
        setSkelLoading(false);
      } catch (err) {
        console.log("backend error:", err);
        toast.error("Failed to load messages");
      }
    };
    contactMessages();
  }, [selectedContact, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const contactId =
        message.senderId === userProfile.userId
          ? message.recieverId
          : message.senderId;

      setConversations((prev) => {
        const existing = prev.find((c) => c.userId === contactId);

        if (existing) {
          return prev.map((c) =>
            c.userId === contactId
              ? {
                  ...c,
                  lastMessage: message.audio?.url
                    ? "🎤 Voice message"
                    : message?.text || "📷 Image",
                  lastMessageAt: message.createdAt,
                  unreadCount:
                    selectedContact?.userId === contactId
                      ? 0
                      : c.unreadCount + 1,
                }
              : c
          );
        }

        // new conversation (edge case)
        return [
          {
            userId: contactId,
            lastMessage: message.audio?.url
              ? "🎤 Voice message"
              : message?.text || "📷 Image",
            lastMessageAt: message.createdAt,
            unreadCount: 1,
          },
          ...prev,
        ];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedContact, userProfile.userId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessagesSeen = ({ messageIds }) => {
      console.log("seen color is setting");
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
        )
      );
    };

    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessagesSeen = ({ messageIds }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.userId === selectedContact?.userId ? { ...c, unreadCount: 0 } : c
        )
      );

      setMessages((prev) =>
        prev.map((m) => (messageIds.includes(m._id) ? { ...m, seen: true } : m))
      );
    };

    socket.on("messagesSeen", handleMessagesSeen);

    return () => socket.off("messagesSeen", handleMessagesSeen);
  }, [socket, selectedContact]);

  const moveConversationToTop = (prev, userId, updates = {}) => {
    const updated = prev.map((c) =>
      c.userId === userId ? { ...c, ...updates } : c
    );

    return updated.sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );
  };

  const postMessage = async (text, images) => {
    if (!selectedContact) return;
    const tempId = crypto.randomUUID(); // or Date.now().toString()
    try {
      if (imagePreviews.length === 0 && text) {
        setMessages((prev) => [
          ...prev,
          {
            _id: tempId,
            clientTempId: tempId,
            senderId: userProfile.userId,
            recieverId: selectedContact.userId,
            text,
            image: [],
            audio: null,
            postStatus: "posting",
            delivered: false,
            seen: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      }

      if (imagePreviews.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            _id: tempId, // TEMP ID
            clientTempId: tempId,
            senderId: String(userProfileId),
            recieverId: String(selectedContact?.userId),

            text: "",
            image: imagePreviews,
            audio: null,
            postStatus: "posting",
            delivered: false,
            seen: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      const responce = await chatContact({
        contactId: selectedContact.userId,
        text,
        images,
        clientTempId: tempId,
      });

      if (responce) {
        if (responce.error) {
          toast.error(responce.error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.clientTempId === tempId
                ? {
                    hidden: true,
                  }
                : msg
            )
          );
          return;
        }
        setMessages((prev) =>
          prev.map((msg) =>
            msg.clientTempId === responce.clientTempId
              ? {
                  ...responce,
                  postStatus: "posted",
                }
              : msg
          )
        );

        setConversations((prev) => {
          const exists = prev.find((c) => c.userId === selectedContact.userId);

          // 1️⃣ Conversation already exists → update it
          if (exists) {
            return prev.map((c) =>
              c.userId === selectedContact.userId
                ? {
                    ...c,
                    lastMessage: responce.audio?.url
                      ? "🎤 Voice message"
                      : responce.text || "📷 Image",
                    lastMessageAt: responce.createdAt,
                    unreadCount: 0,
                  }
                : c
            );
          }

          // 2️⃣ FIRST MESSAGE → CREATE conversation entry
          return [
            {
              userId: selectedContact.userId,
              userName: selectedContact.userName,
              profilePic: selectedContact.profilePic,

              lastMessage: responce.text || "📷 Image",
              lastMessageAt: responce.createdAt,
              unreadCount: 0,
              hasChat: true,
            },
            ...prev, // keep others
          ];
        });
      }
    } catch (err) {
      console.log("backend error:", err);
      toast.error("Message failed to send");
    }
  };

  const postVoiceMessage = async (audioBlob) => {
    if (!selectedContact) return;
    const tempId = crypto.randomUUID(); // or Date.now().toString()
    try {
      if (audioBlob) {
        setMessages((prev) => [
          ...prev,
          {
            _id: tempId, // TEMP ID
            clientTempId: tempId,
            senderId: String(userProfileId),
            recieverId: String(selectedContact?.userId),
            text: "",
            image: null,
            audio: audioBlob,
            postStatus: "posting",
            delivered: false,
            seen: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      const responce = await voiceMessage({
        contactId: selectedContact.userId,
        audioBlob,
        clientTempId: tempId,
      });
      if (responce) {
        if (responce.err) {
          toast.error(responce.err);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.clientTempId === tempId
                ? {
                    hidden: true,
                  }
                : msg
            )
          );
          return;
        }
        setMessages((prev) =>
          prev.map((msg) =>
            msg.clientTempId === responce.clientTempId
              ? {
                  ...responce,
                  postStatus: "posted",
                }
              : msg
          )
        );
        setConversations((prev) =>
          prev.map((c) =>
            c.userId === selectedContact.userId
              ? {
                  ...c,
                  lastMessage: "🎤 Voice message",
                  lastMessageAt: responce.createdAt,
                  unreadCount: 0, // sender never has unread
                }
              : c
          )
        );
      }
    } catch (err) {
      console.log("backend error:", err);
      toast.error("Voice message failed to send");
    }
  };

  useEffect(() => {
    hasEmittedSeenRef.current = false;
  }, [selectedContact]);

  useEffect(() => {
    if (!socket || !selectedContact || messages.length === 0) return;

    // prevent infinite loop
    if (hasEmittedSeenRef.current) return;

    // only unseen messages FROM selected contact
    const unseenFromContact = messages.some(
      (m) => m.senderId === selectedContact.userId && m.seen === false
    );

    if (unseenFromContact) {
      socket.emit("messageSeen", {
        senderId: selectedContact.userId,
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.userId === selectedContact.userId ? { ...c, unreadCount: 0 } : c
        )
      );

      hasEmittedSeenRef.current = true;
    }
  }, [messages, selectedContact, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderId }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [senderId]: true,
      }));
    };

    const handleStopTyping = ({ senderId }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[senderId];
        return copy;
      });
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket && selectedContact) {
        socket.emit("stopTyping", {
          receiverId: selectedContact.userId,
        });
      }
    };
  }, [selectedContact]);

  useEffect(() => {
    if (!socket || !selectedContact) {
      console.log("it is not working :");
      return;
    }
    const handleMessages = (message) => {
      if (
        message.senderId !== selectedContact.userId &&
        message.recieverId !== selectedContact.userId
      ) {
        return;
      }

      setMessages((prev) => [...prev, message]);

      const contactId = message.senderId;

      setConversations((prev) =>
        moveConversationToTop(prev, contactId, {
          lastMessage: message.audio?.url
            ? "🎤 Voice message"
            : message?.text || "📷 Image",
          lastMessageAt: message.createdAt,
          unreadCount:
            selectedContact?.userId === contactId
              ? 0
              : (prev.find((c) => c.userId === contactId)?.unreadCount || 0) +
                1,
        })
      );
    };

    socket.on("newMessage", handleMessages);

    return () => {
      socket.off("newMessage", handleMessages);
    };
  }, [socket, selectedContact]);

  return (
    <ChatContext.Provider
      value={{
        selectedContact,
        setSelectedContact,
        contacts,
        postMessage,
        postVoiceMessage,
        skelLoading,
        setSkelLoading,
        messages,
        setMessages,
        conversations,
        conversationList,
        contactsType,
        setContactsType,
        header,
        setHeader,
        typingUsers,
        imagePreviews,
        setImagePreviews,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export default ChatProvider;
