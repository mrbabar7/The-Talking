import React from "react";
import { SquareX } from "lucide-react";
const Modal = ({ children, className, ...props }) => {
  return (
    <div className="h-screen fixed inset-0  bg-blue-500/10 flex items-center justify-center">
      <div
        className={`border bg-[#02ABF4] max-h-screen overflow-y-auto relative  md:w-100 w-90 p-4 rounded-lg shadow-md ${className}`}
      >
        <div className="absolute top-2 right-2">
          <SquareX className="cursor-pointer" onClick={() => props.onClose()} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
