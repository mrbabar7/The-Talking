import React from "react";
import { useContext } from "react";
import { ProfileContext } from "../provider/profileProvider";
const Reactions = ({ message, reactionEntries }) => {
  const { userProfile } = useContext(ProfileContext);
  return (
    <div
      className={`absolute -bottom-4 ${
        message.senderId === userProfile.userId ? "left-1" : "right-1"
      }`}
      style={{ pointerEvents: "none" }}
    >
      <div
        className="inline-flex items-center  bg-white shadow-sm px-1 py-1 rounded-full"
        style={{ pointerEvents: "auto" }}
      >
        {reactionEntries.map(([emoji, count]) => (
          <div
            key={emoji}
            className="flex items-center  px-1 py-0.5 rounded-full"
          >
            <span className="text-base leading-none">{emoji}</span>
            {count > 1 && <span className="text-xs opacity-70">{count}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reactions;
