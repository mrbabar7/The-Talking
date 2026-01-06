import { useState, useContext, useEffect } from "react";
import { Camera } from "lucide-react";
import { Edit, Edit2 } from "lucide-react";
import { updateProfile } from "../services/profileService";
import { toast } from "react-toastify";
import { ProfileContext } from "../provider/profileProvider";
import { UpdateLoader } from "../partials/Loader";
import { HashLoader } from "react-spinners";
const Profile = () => {
  const { userProfile, update, setUpdate, updateLoading, setUpdateLoading } =
    useContext(ProfileContext);
  const [imagePreview, setImagePreview] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [editedProfile, setEditedProfile] = useState({
    userName: "",
    contact: "",
    about: "",
  });

  useEffect(() => {
    console.log("profile page is rendering");
    setEditedProfile({
      userName: userProfile.userName || "",
      contact: userProfile.contact || "",
      about: userProfile.about || "Hey There I am using Chatty",
    });
    setImagePreview("");
    setNewImage(null);
  }, [update]);

  const handleEditToggle = () => {
    if (update) {
      setImagePreview("");
      setNewImage(null);
    }
    setUpdate(!update);
  };

  const handleEditInput = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setUpdateLoading(true);
    const result = await updateProfile({
      userName: editedProfile.userName,
      contact: editedProfile.contact,
      about: editedProfile.about,
      image: newImage,
    });
    console.log("result is:", result);
    if (result) {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated");
      }
    }
    setTimeout(() => {
      setUpdateLoading(false);
      setUpdate(false);
      setImagePreview("");
      setNewImage(null);
    }, 1000);
  };

  const numberRegex = /^\d{11}$/;

  const disableSave =
    (userProfile.userName === editedProfile.userName &&
      userProfile.contact === editedProfile.contact &&
      userProfile.about === editedProfile.about &&
      !newImage) ||
    editedProfile.userName.trim() === "" ||
    editedProfile.contact.trim() === "" ||
    !numberRegex.test(editedProfile.contact);

  return (
    <div className="h-full flex flex-col md:py-6 py-4  relative items-center ">
      <div className="rounded-full size-31.5 relative">
        <img
          src={
            imagePreview ||
            userProfile.profilePic ||
            "https://res.cloudinary.com/dq3njqvjt/image/upload/v1767558291/chatty_users/i6pnlxizjtywcu0w57vj.webp"
          }
          alt="img"
          className="rounded-full size-full p-1 overflow-hidden object-cover border-2 border-[#F709CB]"
        />
        {update && (
          <label className="absolute bottom-2 right-0">
            <Camera
              color="indigo"
              className="cursor-pointer bg-[#F709CB] rounded-full p-1 size-6"
            ></Camera>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      <div className="md:p-4 p-2 w-full text-center">
        {update ? (
          <input
            type="text"
            value={editedProfile.userName}
            onChange={(e) => {
              handleEditInput("userName", e.target.value);
            }}
            className="font-md text-sm  text-indigo-900 text-center border-indigo-900 border-b focus:outline-none  w-full"
          />
        ) : (
          <span className="text-indigo-900 font-md py-4 text-sm">
            {userProfile.userName}
          </span>
        )}
      </div>
      <div className="w-full flex flex-col md:space-y-5 space-y-4 justify-start items-start md:mt-4 mt-0 bg-indigo-900 shadow-lg p-4">
        <div className="flex flex-col w-full">
          <span className="text-white font-md text-sm mb-1">Email</span>
          <p className="text-[#F709CB] font-md text-sm">{userProfile.email}</p>
        </div>
        <div className="flex flex-col  w-full">
          <div className="flex justify-between items-center">
            <span className="text-white font-md text-sm mb-1">Contact</span>
            {update && <Edit2 size={15} color="white"></Edit2>}
          </div>
          {update ? (
            <input
              type="text"
              value={editedProfile.contact}
              onChange={(e) => {
                handleEditInput("contact", e.target.value);
              }}
              className="font-md text-sm  text-white border-white border-b focus:outline-none  w-full "
            />
          ) : (
            <p className="text-[#F709CB] font-md text-sm">
              {userProfile.contact}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center">
            <span className="text-white font-md text-sm mb-1">About</span>
            {update && <Edit2 size={15} color="white"></Edit2>}
          </div>
          {update ? (
            <textarea
              type="text"
              value={editedProfile.about}
              onChange={(e) => {
                handleEditInput("about", e.target.value);
              }}
              rows={3}
              className="font-md text-sm  text-white border-white border-b focus:outline-none  w-full "
            />
          ) : (
            <p className="text-[#F709CB] font-md text-sm">
              {userProfile.about}
            </p>
          )}
        </div>
        <div className="flex justify-end  w-full">
          {!update ? (
            <button className="cursor-pointer" onClick={handleEditToggle}>
              <Edit color="white"></Edit>
            </button>
          ) : (
            <div className="flex justify-between items-center gap-4">
              <button
                className="bg-green-700 text-white text-sm p-2 rounded-md cursor-pointer"
                onClick={handleSaveProfile}
                disabled={disableSave}
              >
                Save
              </button>
              <button
                className="bg-red-700 text-white text-sm p-2 rounded-md cursor-pointer"
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col mt-auto gap-5 p-4 w-full">
        <div className="flex justify-between items-center ">
          <span className="text-indigo-900 font-md text-sm">Member since</span>
          <span className="text-[#F709CB] font-md text-sm">11 march, 2025</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-indigo-900 font-md text-sm">
            Account Status
          </span>
          <span className="text-[#F709CB] font-md text-sm">Active</span>
        </div>
      </div>
      {updateLoading && (
        <UpdateLoader>
          <HashLoader size={30} color="#F709CB"></HashLoader>
        </UpdateLoader>
      )}
    </div>
  );
};
export default Profile;
