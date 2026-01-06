import { createContext, useState, useEffect } from "react";
export const ProfileContext = createContext({
  userProfile: [],
  update: false,
  setUpdate: () => {},
  setUserProfile: () => {},
});
import { addProfile } from "../services/profileService";
import { toast } from "react-toastify";
const ProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [secondDisplay, setSecondDisplay] = useState("contacts");
  useEffect(() => {
    const profileCheck = async () => {
      try {
        const responce = await addProfile();
        if (responce) {
          if (responce.message) {
            console.log(responce.message);
            toast.error(responce.message);
            return;
          }
          setUserProfile(responce.profile);
        }
      } catch (err) {
        console.log("error while adding profile is: ", err);
      }
    };
    profileCheck();
  }, [update]);

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        setUserProfile,
        update,
        setUpdate,
        updateLoading,
        setUpdateLoading,
        secondDisplay,
        setSecondDisplay,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
export default ProfileProvider;
