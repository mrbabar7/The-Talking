import React from "react";

const AboutDescription = ({ status }) => {
  return (
    <div className="relative h-full overflow-y-auto scrollbar-indigo">
      <div
        className={`absolute inset-0 px-6  transition-transform duration-500 ease-in-out flex flex-col justify-center md:space-y-2 space-y-1 bg-transparent ${
          status === "description" ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={status !== "description"}
      >
        <h1 className="md:text-lg text-md font-semibold accent">Description</h1>
        <p className="text-app font-md text-sm  md:text-base ">
          Chatty is a modern real-time messaging platform designed to deliver
          fast, secure, and intuitive communication.
          <span className="hidden md:contents">
            {" "}
            Built with performance, scalability, and user experience at its
            core,
          </span>
          Chatty enables people to stay connected through text, images and
          voice.
        </p>
        <h1 className="md:text-lg text-md font-semibold accent">
          What Makes Chatty Different?
        </h1>
        <p className="text-app font-md text-sm  md:text-base  ">
          Chatty is crafted using modern technologies and real-world messaging
          patterns inspired by industry-leading platforms.
        </p>
        <h1 className="md:text-lg text-md font-semibold accent">
          Built with Passion
        </h1>
        <p className="text-app font-md text-sm  md:text-base ">
          Chatty is built with attention to detail, real-world use cases, and a
          deep focus on user experience. Every feature is designed to feel
          natural — just the way communication should be.
        </p>
      </div>

      <div
        className={`absolute inset-0 px-6 pt-2 md:pt-0 transition-transform duration-500 ease-in-out flex flex-col justify-center md:space-y-2 space-y-1  bg-transparent ${
          status === "features" ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={status !== "features"}
      >
        <h1 className="md:text-lg text-md font-semibold accent">
          Key Features
        </h1>
        <ul className="text-app font-md list-disc text-sm  md:text-base ">
          <li>Real-time messaging with instant delivery.</li>
          <li>Image sharing with upload previews.</li>
          <li>Voice messages with waveform playback.</li>
          <li>Message reactions. (emoji support)</li>
          <li>Read & delivery receipts Delete for me / everyone.</li>
          <li>Optimistic UI for smooth user experience.</li>
          <li>Typing indicators Conversation-based contact sorting.</li>
        </ul>
        <h1 className="md:text-lg text-md font-semibold accent">
          Security & Privacy
        </h1>
        <ul className="text-app font-md list-disc text-sm  md:text-base  ">
          <li>Secure message handling.</li>
          <li>No unnecessary data collection.</li>
          <li>Media stored safely using trusted cloud services.</li>
          <li>Built with best practices in mind.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutDescription;
