import React, { useContext } from "react";
import { ChatContext } from "../provider/ChatProvider";

const ContactsSkeleton = () => {
  const { contacts } = useContext(ChatContext);
  const skeletonCount = contacts.length;
  return (
    <div className="h-full flex md:flex-col overflew-auto scrollbar-fuck">
      {[...Array(skeletonCount)].map((_, idx) => (
        <div key={idx}>
          <div className="hidden md:flex items-center gap-4 my-3 px-3">
            <div className="skeleton size-16  min-w-14 min-h-14 shrink-0 rounded-full bg-indigo-400"></div>
            <div className="flex flex-col gap-2">
              <div className="skeleton h-3 w-25 bg-indigo-400"></div>
              <div className="skeleton h-3 w-25 bg-indigo-400"></div>
            </div>
          </div>
          <div className="md:hidden flex justify-center items-center px-3 gap-3 my-2">
            <div className="skeleton size-16  min-w-14 min-h-14 shrink-0 rounded-full bg-indigo-400"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactsSkeleton;
