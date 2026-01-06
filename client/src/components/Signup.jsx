import React, { useState } from "react";
import { postSignup } from "../services/authService";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
const Signup = ({ setModalChild }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    contact: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setErrors({});
    setLoading(true);
    try {
      const response = await postSignup(formData);
      console.log("Server response:", response); // Debug log

      // Handle validation errors (422 status)
      if (response.errors && Array.isArray(response.errors)) {
        const backendErrors = {};

        const inferField = (msg) => {
          const m = (msg || "").toLowerCase();
          if (m.includes("user") || m.includes("name")) return "userName";
          if (m.includes("email")) return "email";
          if (m.includes("contact") || m.includes("phone")) return "contact";
          if (m.includes("password")) return "password";
          return "_global";
        };

        response.errors.forEach((error) => {
          // Some backends may not include `param`; fall back to inference from message
          const key = error.param || inferField(error.msg || "");
          const mappedKey = key === "_global" ? "_global" : String(key);
          // Append messages if multiple errors for same field
          if (backendErrors[mappedKey]) {
            backendErrors[mappedKey] += " \n" + (error.msg || "Invalid value");
          } else {
            backendErrors[mappedKey] = error.msg || "Invalid value";
          }
          console.log(`Field error: ${mappedKey} - ${error.msg}`); // Debug log
        });

        // Move any _global messages to apiError
        if (backendErrors._global) {
          setApiError(backendErrors._global);
          toast.error(backendErrors._global);
          delete backendErrors._global;
        }

        setErrors(backendErrors);
        return;
      }

      // Handle server/database errors
      if (response.message) {
        const errorMessage =
          response.message || "Signup failed. Please try again.";
        console.log("API Error:", errorMessage); // Debug log
        setApiError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Handle success case
      if (response && response.user) {
        toast.success("Signup successful. Please login.");
        if (setModalChild) {
          setModalChild("login");
        }
        return;
      }

      // Unexpected response format
      setApiError("Unexpected response from server. Please try again.");
    } catch (error) {
      const msg = "Network error or server unavailable. Please try again.";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
      <h3 className="text-xl font-bold text-gray-900 text-center">Sign up</h3>
      {apiError && (
        <span className="border border-red-800 text-sm bg-red-700 p-2 rounded-md text-white text-center">
          {apiError}
        </span>
      )}
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="userName" className="text-gray-900 block text-sm">
            Enter name
          </label>
          <input
            type="text"
            placeholder="name"
            id="userName"
            name="userName"
            required
            value={formData.userName}
            onChange={handleChange}
            className="block w-full py-2 px-3 text-sm border rounded-md "
          />
          {errors.userName && (
            <span className="text-sm text-red-600 font-md">
              {errors.userName}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-gray-900 block text-sm">
            Enter email
          </label>
          <input
            type="email"
            placeholder="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full py-2 px-3 text-md border rounded-md block text-sm "
          />
          {errors.email && (
            <span className="text-sm text-red-600 font-md">{errors.email}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact" className="text-gray-900 block text-sm">
            Enter contact
          </label>
          <input
            type="tel"
            placeholder="phone"
            id="contact"
            name="contact"
            required
            value={formData.contact}
            onChange={handleChange}
            className="w-full py-2 px-3 text-md border rounded-md block text-sm "
          />
          {errors.contact && (
            <span className="text-sm text-red-600 font-md">
              {errors.contact}
            </span>
          )}
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
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full py-2 px-3 text-md border rounded-md block text-sm "
          />
          {errors.password && (
            <span className="text-sm text-red-600 font-md">
              {errors.password}
            </span>
          )}
        </div>
        <button
          className="border-none hover:bg-[#C027D9] bg-gray-900 text-white w-full rounded-md p-2 text-sm transition-all duration-200
          cursor-pointer mt-2"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="flex gap-2 justify-center items-center">
              <span>Signing up</span>
              <PulseLoader size={8} color="white" />{" "}
            </div>
          ) : (
            "Sign up"
          )}
        </button>
      </form>
      <div className="flex gap-2 justify-center items-center">
        <span className="text-sm text-gray-900 font-md">
          Dont have an account!
        </span>
        <button
          className="border-none focus-outline-none text-sm text-gray-900 font-bold cursor-pointer"
          onClick={() => setModalChild("login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
