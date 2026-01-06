import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { RotateLoader } from "react-spinners";
const Logout = ({ setModalOpen }) => {
  const { handleLogout, logoutLoading } = useContext(AuthContext);
  return (
    <div className="p-2  h-[120px]">
      {!logoutLoading ? (
        <div className="flex flex-col space-y-2 items-center">
          <span className="font-bold text-gray-900 text-md">Confirmation</span>
          <span className="text-sm font-md">
            Are you sure, you want to do Logout
          </span>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                handleLogout();
                setTimeout(() => {
                  setModalOpen(false);
                }, 2000);
              }}
              className="text-sm border rounded-md px-3 py-2 bg-green-600 text-white cursor-pointer"
            >
              Confirm
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="text-sm border rounded-md px-3 py-2 bg-red-600 text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-10  h-full pt-10">
          <RotateLoader size={12} color="white"></RotateLoader>
          <span className="text-sm text-white font-md">Logging out...</span>
        </div>
      )}
    </div>
  );
};
export default Logout;
