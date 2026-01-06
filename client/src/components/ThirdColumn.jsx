import React, { useContext } from "react";
import EmptyBoard from "./EmptyBoard";
import MessageBoard from "./MessageBoard";
import AboutBoard from "./AboutBoard";
import { ChatContext } from "../provider/ChatProvider";
import { ProfileContext } from "../provider/profileProvider";
const ThirdColumn = () => {
  const { selectedContact } = useContext(ChatContext);
  const { secondDisplay } = useContext(ProfileContext);
  if (secondDisplay === "about") {
    return (
      <div className="md:col-span-8 col-span-12 flex-1  order-2 md:order-0 overflow-y-auto chat-scroll h-full third-col-bg text-app">
        <AboutBoard></AboutBoard>
      </div>
    );
  }

  return (
    <div className="md:col-span-8 col-span-12 order-2 md:order-0 overflow-y-auto chat-scroll h-full flex-1 third-col-bg text-app">
      {selectedContact ? (
        <MessageBoard></MessageBoard>
      ) : (
        <EmptyBoard></EmptyBoard>
      )}
    </div>
  );
};

export default ThirdColumn;
