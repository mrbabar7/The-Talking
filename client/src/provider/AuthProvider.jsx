import { createContext, useState, useEffect, useRef } from "react";
export const AuthContext = createContext({
  isLoggedIn: false,
  loading: false,
  logoutLoading: false,
  setLoading: () => {},
  serverError: [],
  setIsLoggedIn: () => {},
});
import { io } from "socket.io-client";
import { checkUser, logout } from "../services/authService";
import { toast } from "react-toastify";
const AuthProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;
  const socketRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userProfileId, setUserProfileId] = useState(null);
  const connectSocket = (userId) => {
    if (socketRef.current) {
      return;
    }
    socketRef.current = io(BASE_URL, {
      path: import.meta.env.VITE_SOCKET_PATH || "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
      query: {
        userId: userId,
      },
    });
    socketRef.current.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };
  const disConnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setOnlineUsers([]);
    }
  };

  useEffect(() => {
    const sessionCheck = async () => {
      try {
        const responce = await checkUser();
        if (responce) {
          if (responce.message) {
            setServerError(responce.message);
            toast.error(responce.message);
            return;
          }
          console.log("responce user log is:", responce.user);
          setIsLoggedIn(responce.isLogged);
          if (responce.user) {
            connectSocket(responce.user._id);
            setUserProfileId(responce.user._id);
          }
        }
      } catch {
        setServerError(" Server error catch, please try again!");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };
    sessionCheck();
  }, [loading]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    setTimeout(async () => {
      try {
        const responce = await logout();
        if (responce) {
          if (responce.err) {
            toast.error(responce.err || "Logout failed");
            return;
          }
          setLogoutLoading(false);
          setLoading(true);
          toast.success("Logged out successfully");
          console.log("socket disconncting");
          disConnectSocket();

          return;
        }
      } catch (err) {
        console.log("err while loging out", err);
        toast.error("Logout failed");
      } finally {
        setLogoutLoading(false);
      }
    }, 2000);
  };
  return (
    <AuthContext.Provider
      value={{
        socket: socketRef.current,
        isLoggedIn,
        setIsLoggedIn,
        loading,
        setLoading,
        serverError,
        handleLogout,
        logoutLoading,
        onlineUsers,
        userProfileId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
