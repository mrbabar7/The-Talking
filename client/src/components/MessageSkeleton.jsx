import React from "react";

const MessageSkeleton = () => {
  const skeletonCount = 4;
  return (
    <div className="h-full">
      {[...Array(skeletonCount)].map((_, idx) => (
        <div key={idx} className="w-full flex flex-col space-y-3">
          <div className="flex md:w-100 w-50 flex-col gap-3 mr-auto ">
            <div className="flex items-center md:gap-4 gap-3">
              <div className="skeleton size-14 shrink-0 rounded-full bg-indigo-400"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-3 md:w-35 w-22 bg-indigo-400"></div>
                <div className="skeleton h-3 md:w-43 w-30 bg-indigo-400"></div>
              </div>
            </div>
          </div>
          <div className="flex md:w-100 w-50 flex-col  gap-3 ml-auto ">
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex flex-col md:gap-4 gap-3">
                <div className="skeleton h-3 md:w-35 w-22 bg-indigo-400"></div>
                <div className="skeleton h-3 md:w-43 w-30 bg-indigo-400"></div>
              </div>
              <div className="skeleton size-14 shrink-0 rounded-full bg-indigo-400"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
