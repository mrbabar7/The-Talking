import React, { useState } from "react";
import AboutDescription from "./AboutDescription";
import { ArrowRight, ArrowLeft } from "lucide-react";

const AboutBoard = () => {
  const [status, setStatus] = useState("description");
  return (
    <div className="h-full flex flex-col md:gap-5 gap-3 lg:p-8 md:p-4 py-4 px-2">
      <div className="flex justify-center">
        <h2 className="text-app text-xl font-semibold border-b-2 border-accent w-fit">
          About Us
        </h2>
      </div>
      <div className="flex lg:space-x-5 space-x-2 h-full items-center justify-center lg:mx-12 mx-0">
        <button
          aria-label="Show description"
          onClick={() => setStatus("description")}
          className="md:p-2 p-1 rounded-full hover-theme focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <ArrowLeft className="md:w-6 md:h-6 w-4 h-4 text-app" />
        </button>

        <div className="border-2 border-accent lg:rounded-tl-[10rem] md:rounded-tl-[5rem] rounded-tl-[3rem] card-bg md:rounded-br-[5rem] lg:rounded-br-[10rem] rounded-br-[3rem] h-full lg:p-12 md:p-10 w-full">
          <AboutDescription status={status} />
        </div>

        <button
          aria-label="Show features"
          onClick={() => setStatus("features")}
          className="md:p-2 p-1 rounded-full hover-theme focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <ArrowRight className="md:w-6 md:h-6 w-4 h-4 text-app" />
        </button>
      </div>
    </div>
  );
};

export default AboutBoard;
