import UserList from "../components/UserList";
import { Search } from "lucide-react";
import { useContext, useState } from "react";
import { ChatContext } from "../provider/ChatProvider";
import OnlineUserList from "./OnlineUserList";
const ContactList = () => {
  const { contactsType, setContactsType } = useContext(ChatContext);
  const [searchContact, setSearchContact] = useState("");
  return (
    <div className="h-full flex flex-col overflow-y-auto py-4 md:px-0 px-3">
      <div className="hidden md:flex items-center justify-center mx-4 rounded-4xl search-bg">
        <Search className="text-app mx-2" />
        <input
          type="text"
          placeholder="search contacts"
          value={searchContact}
          onChange={(e) => setSearchContact(e.target.value)}
          className="rounded-4xl text-md w-full p-2 text-app outline-none focus:outline-none"
        />
      </div>
      <div className="flex md:flex-col flex-row md:gap-4 gap-2 md:mt-4 mt-2">
        <div className="flex md:flex-row flex-col md:gap-3 gap-2 justify-start items-center md:px-4 px-0">
          <div
            className={`shadow-md cursor-pointer rounded-4xl py-2 px-4 text-sm ${
              contactsType === "all" ? "btn-selected" : "btn-unselected"
            }`}
            onClick={() => setContactsType("all")}
          >
            All
          </div>
          <div
            className={`shadow-md cursor-pointer rounded-4xl py-2 px-4 text-sm ${
              contactsType === "online" ? "btn-selected" : "btn-unselected"
            }`}
            onClick={() => setContactsType("online")}
          >
            Online
          </div>
        </div>
        {contactsType === "all" ? (
          <UserList searchContact={searchContact}></UserList>
        ) : (
          <OnlineUserList></OnlineUserList>
        )}
      </div>
    </div>
  );
};
export default ContactList;
