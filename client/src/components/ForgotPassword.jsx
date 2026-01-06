import { toast } from "react-toastify";
import { useState } from "react";
import { forgotPassword } from "../services/authService";
import { ArrowLeft } from "lucide-react";
const ForgotPassword = ({ setModalChild }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const disableButton = emailRegex.test(email);

  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      const responce = await forgotPassword(email);
      if (responce) {
        if (responce.err) {
          setApiError(responce.err);
          return;
        }
        toast.success(responce.message);
        setModalChild("login");
      }
    } catch (err) {
      toast.error("There is something Wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="text-xl font-bold text-gray-900 text-center">
        Forgot Password
      </h3>
      {apiError && (
        <p className="text-center py-1.5 bg-red-600 text-white text-sm">
          {apiError}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-gray-900 block text-sm">
          Enter email
        </label>
        <input
          type="email"
          required
          placeholder="email"
          className="w-full py-2 px-3 text-md border rounded-md block text-sm "
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        onClick={handleEmailSubmit}
        disabled={loading || !disableButton}
        className="bg-gray-900 text-white p-2 rounded cursor-pointer"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <button
        className="border-none focus-outline-none text-sm text-gray-900 font-bold cursor-pointer w-fit"
        onClick={() => setModalChild("login")}
      >
        <ArrowLeft></ArrowLeft>
      </button>
    </div>
  );
};
export default ForgotPassword;
