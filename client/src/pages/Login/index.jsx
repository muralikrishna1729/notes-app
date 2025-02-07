import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../assets/login.jpg";
import PassWordInput from "@/components/PassWordInput";
import { useState } from "react";
import { validateEmail } from "@/utils/helper";
import axiosInstance from "@/utils/axiosinstance";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please Enter a Valid Email");
      return;
    }
    setError("");
    if (!password) {
      setError("Please Enter Password");
      return;
    }

    // Login API call from Backend
    try {
      const response = await axiosInstance.post("/login", { email, password });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard"); // Redirect to home after login
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }; // <-- MISSING CLOSING BRACE ADDED HERE

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center bg-gray-50 max-h-full gap-20">
        <img
          src={loginImage}
          className="w-96 h-auto rounded-sm mt-20 mb-20"
          alt="Login Image"
        />
        <div className="w-96 border rounded-lg bg-white shadow-lg px-8 py-10 mt-10 mb-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-6">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PassWordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-xs text-red-500 pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
