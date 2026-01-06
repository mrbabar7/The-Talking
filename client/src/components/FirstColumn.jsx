import React, { useEffect, useState } from "react";
import {
  User,
  MessageCircleMore,
  Settings,
  LogOut,
  ChessQueen,
} from "lucide-react";
import { useContext } from "react";
import { ProfileContext } from "../provider/profileProvider";
const FirstColumn = ({ setModalOpen }) => {
  const { setSecondDisplay, secondDisplay } = useContext(ProfileContext);
  const handleLogoutClick = () => {
    setModalOpen(true);
  };
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // responsive CSS vars: first header (56px) and second column height (80px on md+, 40vh on small)
    const setVars = () => {
      const isSmall = window.innerWidth < 768;
      document.documentElement.style.setProperty("--first-height", "56px");
      document.documentElement.style.setProperty(
        "--second-height",
        isSmall ? "40vh" : "80px"
      );
    };

    setVars();

    let lastScroll = window.pageYOffset || 0;
    let ticking = false;

    const handleScroll = () => {
      const current = window.pageYOffset || 0;
      if (window.innerWidth >= 768) return; // only autohide on small screens
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (current > lastScroll && current > 50) {
            setHidden(true);
          } else {
            setHidden(false);
          }
          lastScroll = current <= 0 ? 0 : current;
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => setVars();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // sync CSS var when hidden changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--first-height",
      hidden ? "0px" : "56px"
    );
  }, [hidden]);
  return (
    <div
      className={`fixed md:relative top-0 left-0 right-0 z-40 md:col-span-1 col-span-12 bg-indigo-900
         flex md:flex-col flex-row items-center md:items-center md:pb-8 p-2 md:p-0 md:h-full h-14 
         transform transition-transform duration-300 ${
           hidden ? "-translate-y-full" : "translate-y-0"
         }`}
      aria-hidden={hidden}
    >
      <img
        src="https://res.cloudinary.com/dq3njqvjt/image/upload/v1767277192/chatty_users/bfddzdrismty4k1n5we4.png"
        alt="img"
        className="size-16 md:size-20 "
      />
      <div
        className="flex flex-row md:flex-col items-center md:space-y-4 md:mt-1.5 mt-0
      
     px-4 md:px-0 w-full  justify-around"
      >
        <div
          className={`md:w-full flex justify-center py-4 w-full items-center ${
            secondDisplay === "contacts" && "bg-white"
          }`}
        >
          <button
            className="border-0 outline-none cursor-pointer md:size-7 size-5"
            onClick={() => setSecondDisplay("contacts")}
          >
            <MessageCircleMore
              className={`size-full ${
                secondDisplay === "contacts" ? "text-indigo-800" : "text-white"
              }`}
            />
          </button>
        </div>
        <div
          className={`md:w-full flex justify-center py-4 w-full items-center ${
            secondDisplay === "profile" && "bg-white"
          }`}
        >
          <button
            className="border-0 outline-none cursor-pointer md:size-7 size-5"
            onClick={() => setSecondDisplay("profile")}
          >
            <User
              className={`size-full ${
                secondDisplay === "profile" ? "text-indigo-800" : "text-white"
              }`}
            />
          </button>
        </div>
        <div
          className={`md:w-full flex justify-center py-4 w-full items-center ${
            secondDisplay === "settings" && "bg-white"
          }`}
        >
          <button
            className="border-0 outline-none cursor-pointer md:size-7 size-5"
            onClick={() => setSecondDisplay("settings")}
          >
            <Settings
              className={` size-full ${
                secondDisplay === "settings" ? "text-indigo-800" : "text-white"
              }`}
            />
          </button>
        </div>
        <div
          className={`md:w-full flex justify-center py-4 w-full items-center ${
            secondDisplay === "about" && "bg-white"
          }`}
        >
          <button
            className="border-0 outline-none cursor-pointer md:size-7 size-5"
            onClick={() => setSecondDisplay("about")}
          >
            <ChessQueen
              className={` size-full ${
                secondDisplay === "about" ? "text-indigo-800" : "text-white"
              }`}
            />
          </button>
        </div>
      </div>
      <div className="md:mt-auto ml-auto md:ml-0 md:px-0 px-2">
        <button
          className="border-0 outline-none cursor-pointer md:size-7 size-5"
          onClick={handleLogoutClick}
        >
          <LogOut className="text-white size-full" />
        </button>
      </div>
    </div>
  );
};
export default FirstColumn;
