import React, { useContext, useState } from "react";
import { postLogin } from "../services/authService";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import { AuthContext } from "../provider/AuthProvider";
const Login = ({ setModalChild, setModalOpen }) => {
  const { setLoading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setModalLoading(true);
    try {
      const responce = await postLogin(formData);
      if (responce.err) {
        setApiError(responce.err);
        toast.error(responce.err);
        return;
      }
      if (responce.user) {
        console.log("login is successful");
        toast.success("Logged in successfully");
        setModalChild("");
        setModalOpen(false);
        setLoading(true);
        return;
      }
    } catch (err) {
      const msg = "Internal server Error. Please try again!";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setModalLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="p-4 flex w-full flex-col space-y-3">
      <h3 className="text-xl font-bold text-gray-900 text-center">Login</h3>
      {apiError && (
        <span className="border border-red-800 text-sm bg-red-700 p-2 rounded-md text-white text-center">
          {apiError}
        </span>
      )}
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-gray-900 block text-sm">
            Enter email
          </label>
          <input
            type="email"
            placeholder="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full py-2 px-3 text-md border rounded-md block text-sm "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-gray-900 block text-sm">
            Enter password
          </label>
          <input
            type="password"
            placeholder="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full py-2 px-3 text-md border rounded-md block text-sm "
          />
        </div>

        <div className="-mt-2 text-right">
          <button
            className="text-sm font-md w-fit  cursor-pointer hover:text-[#C027D9]"
            onClick={() => setModalChild("forgotPassword")}
          >
            Forgot Password?
          </button>
        </div>

        <button
          className="border-none hover:bg-[#C027D9] bg-gray-900 text-white w-full rounded-md p-2 text-sm transition-all duration-200
          cursor-pointer mt-2"
          type="submit"
          disabled={modalLoading}
        >
          {modalLoading ? (
            <div className="flex gap-2 justify-center items-center">
              <span>Logining in</span>
              <PulseLoader size={8} color="white" />{" "}
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
      <div className="flex gap-2 justify-center items-center">
        <span className="text-sm text-gray-900 font-md">
          Already have an account!
        </span>
        <button
          className="border-none focus-outline-none text-sm text-gray-900 font-bold cursor-pointer"
          onClick={() => setModalChild("signup")}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Login;
