import React, { useContext, useState } from "react";
import MessageContainer from "./MessageContainer";
import MessageHeader from "./MessageHeader";
import { ChatContext } from "../provider/ChatProvider";
import MessageProvider from "../provider/MessageProvider";
import PostingBlock from "./PostingBlock";
const MessageBoard = () => {
  const { header } = useContext(ChatContext);
  return (
    <MessageProvider>
      <div className="flex flex-col h-full">
        {header && <MessageHeader></MessageHeader>}
        <MessageContainer></MessageContainer>
        <PostingBlock></PostingBlock>
      </div>
    </MessageProvider>
  );
};

export default MessageBoard;
