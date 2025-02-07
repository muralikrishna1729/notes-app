import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import SignInImage from "../../assets/register.jpg";
import PassWordInput from "@/components/PassWordInput";
import { useState } from "react";
import { validateEmail } from "@/utils/helper";
import axiosInstance from "@/utils/axiosinstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Added useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password.");
      return;
    }

    // Register API call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email,
        password,
      });

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard"); // Redirect after signup
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center bg-gray-50 min-h-screen gap-20">
        <div className="w-96 border rounded-lg bg-white shadow-lg px-8 py-10 mt-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl font-semibold mb-6">Create New Account</h4>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded-md mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded-md mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PassWordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-xs text-red-500 pb-1">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md mt-4"
            >
              Register
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 underline">
                Login
              </Link>
            </p>
          </form>
        </div>
        <img
          src={SignInImage}
          className="w-96 h-auto rounded-sm mt-20 mb-20"
          alt="Sign Up"
        />
      </div>
    </div>
  );
};

export default SignUp;
