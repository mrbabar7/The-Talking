import React, { useContext } from "react";
import ContactList from "./ContactList";
import Profile from "./Profile";
import Settings from "./Settings";
import About from "./About";
import { ProfileContext } from "../provider/profileProvider";
const SecondColumn = () => {
  const { secondDisplay } = useContext(ProfileContext);
  // use CSS var --first-height to position under the header (it updates when header hides)
  return (
    <div
      className="md:col-span-3 col-span-12 order-first md:order-0 bg-app text-app overflow-y-auto 
      scrollbar-indigo md:h-full h-auto mt-12 md:mt-0 z-30"
    >
      {secondDisplay === "contacts" && <ContactList></ContactList>}
      {secondDisplay === "profile" && <Profile></Profile>}
      {secondDisplay === "settings" && <Settings></Settings>}
      {secondDisplay === "about" && <About></About>}
    </div>
  );
};

export default SecondColumn;
