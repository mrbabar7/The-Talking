import React, { useState, useEffect, useRef } from "react";
import { Camera, SendHorizonal, X } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "../provider/ChatProvider";
import { AuthContext } from "../provider/AuthProvider";
const InputMessage = () => {
  const { postMessage, selectedContact, imagePreviews, setImagePreviews } =
    useContext(ChatContext);
  const { socket } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  // const [imagePreviews, setImagePreviews] = useState([]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);

    e.target.value = ""; // allow re-selecting same image
  };

  // ✅ remove single image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  useEffect(() => {
    setText("");
    setImagePreviews([]);
    setImages([]);
  }, [selectedContact]);

  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);

    if (!socket || !selectedContact) return;

    socket.emit("typing", {
      receiverId: selectedContact.userId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selectedContact.userId,
      });
    }, 800);
  };

  const handlePostMessage = () => {
    console.log("message:", text);
    console.log("images:", images);
    postMessage(text, images);
    setText("");
    setImagePreviews([]);
    setImages([]);
  };

  return (
    // <div className="flex flex-col gap-3 mt-auto mx-10 md:mb-3 mb-2">
    <div className="flex flex-1 flex-col gap-3 justify-between w-full">
      {/* 🔥 Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative w-24 h-24 rounded-xl overflow-hidden"
            >
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 cursor-pointer bg-indigo-700 hover:bg-indigo-600 text-white rounded-full p-1 shadow-md"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center px-3 rounded-full w-full border border-indigo-900">
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={handleInputChange}
          className="w-full p-2 outline-none"
        />

        <label className="cursor-pointer">
          <Camera className="mx-4 text-indigo-900" />
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageChange}
          />
        </label>
        <button
          className="cursor-pointer mx-2"
          disabled={text.trim() === "" && images.length === 0}
          onClick={handlePostMessage}
        >
          <SendHorizonal className="text-indigo-900" />
        </button>
      </div>
    </div>
  );
};

export default InputMessage;
