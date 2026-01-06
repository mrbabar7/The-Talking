import React, { useState } from "react";
import InputMessage from "./InputMessage";
import VoiceMessage from "./VoiceMessage";
const PostingBlock = () => {
  return (
    <div className="flex items-end gap-3 justify-between mt-auto mx-10 md:mb-3 mb-2">
      <InputMessage />
      <VoiceMessage />
    </div>
  );
};

export default PostingBlock;
