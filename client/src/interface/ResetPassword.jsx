import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../services/authService";
import { Eye, EyeOff } from "lucide-react";
const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [eyeOn, setEyeOn] = useState(false);
  const [apiError, setApiError] = useState(null);
  const disableButton = newPassword === password && password.length >= 6;

  const handleResetSubmit = async () => {
    setLoading(true);
    try {
      const res = await resetPassword(password, token);
      if (res) {
        if (res.error) {
          setApiError(res.error);
          return;
        }
        toast.success(res.message || "Password reset successful");
        navigate("/");
      }
    } catch (err) {
      console.log("error while setting reset password responce: ", err);
      setApiError("There is something wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 p-6 border rounded space-y-4">
        <div className="flex justify-center">
          <img
            src="https://res.cloudinary.com/dq3njqvjt/image/upload/v1767277192/chatty_users/bfddzdrismty4k1n5we4.png"
            alt="img"
            className="w-20 h-20 md:w-26 md:h-26"
          />
        </div>
        <h2 className="text-xl font-bold text-center">Reset Password</h2>
        {!apiError ? (
          <p className="text-center text-sm">
            Use at least 6 characters and make a strong password.
          </p>
        ) : (
          <p className="text-center py-1.5 bg-red-600 text-white text-sm">
            {apiError}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-gray-900 block text-sm">
            New password
          </label>
          <div className="flex justify-between items-center px-3 w-full border rounded-md">
            <input
              type={eyeOn ? "text" : "password"}
              placeholder="New Password"
              id="new password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2 text-md  focus:outline-0   text-sm "
            />
            {eyeOn ? (
              <Eye onClick={() => setEyeOn(false)}></Eye>
            ) : (
              <EyeOff onClick={() => setEyeOn(true)}></EyeOff>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-gray-900 block text-sm">
            Confirm password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirm password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-2 px-3 text-md border rounded-md block text-sm "
          />
        </div>

        <button
          onClick={handleResetSubmit}
          disabled={loading || !disableButton}
          className="bg-gray-900 text-white p-2 w-full rounded cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};
export default ResetPassword;
