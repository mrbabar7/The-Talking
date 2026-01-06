import React from "react";

const EmptyBoard = () => {
  return (
    <div className="flex h-full flex-col justify-center items-center">
      <div className="flex gap-3 animate-bounce">
        <img
          src="https://res.cloudinary.com/dq3njqvjt/image/upload/v1767277192/chatty_users/bfddzdrismty4k1n5we4.png"
          alt="img"
          className="size-40 overflow-hidden object-cover "
        />
      </div>
      <span className="text-md font-md text-indigo-900">
        Select a Contact to start Conversation
      </span>
    </div>
  );
};

export default EmptyBoard;
