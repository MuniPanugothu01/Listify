import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sign = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Get all registered users from localStorage
  const getRegisteredUsers = () => {
    const users = localStorage.getItem("registeredUsers");
    return users ? JSON.parse(users) : [];
  };

  // Save new user to registered users list
  const saveUserToRegistered = (userData) => {
    const existingUsers = getRegisteredUsers();
    const updatedUsers = [...existingUsers, userData];
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  };

  // Check if user exists and credentials match
  const validateUserCredentials = (email, password) => {
    const registeredUsers = getRegisteredUsers();
    return registeredUsers.find(
      (user) => user.email === email && user.password === password
    );
  };

  // Check if email already exists
  const isEmailRegistered = (email) => {
    const registeredUsers = getRegisteredUsers();
    return registeredUsers.some((user) => user.email === email);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!signInEmail || !signInPassword) {
      setError("Please fill in all fields");
      return;
    }

    const user = validateUserCredentials(signInEmail, signInPassword);

    if (user) {
      // User exists and credentials match - log them in and go to home
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.name,
          email: user.email,
          isLoggedIn: true,
          profileImage: user.profileImage || "",
        })
      );
      navigate("/");
    } else {
      setError("Invalid email or password. Please check your credentials.");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!signUpName || !signUpEmail || !signUpPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (isEmailRegistered(signUpEmail)) {
      setError("Email already registered. Please sign in instead.");
      return;
    }

    // Create user data
    const userData = {
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword, // In real app, this should be hashed
      profileImage: "",
      createdAt: new Date().toISOString(),
    };

    // Save to registered users
    saveUserToRegistered(userData);

    // Show success message and redirect to sign-in
    setSuccessMessage("Account created successfully! Please sign in.");

    // Clear form
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");

    // Switch to sign-in form after a brief delay
    setTimeout(() => {
      setIsSignUpActive(false);
      setSuccessMessage("");
    }, 2000);
  };

  return (
    <div className="bg-[#F3F3F3] flex justify-center items-center flex-col min-h-screen font-sans p-5 pb-12">
      <div className="container bg-white rounded-lg shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)] relative overflow-hidden w-full max-w-3xl min-h-[600px] mx-auto transition-all duration-600 ease-in-out">
        {/* Success Message */}
        {successMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center">
              <span className="text-sm">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center">
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Sign Up Container */}
        <div
          className={`form-container sign-up-container absolute top-1/2 sm:top-0 h-1/2 sm:h-full transition-all duration-600 ease-in-out left-0 w-full sm:w-1/2 ${
            isSignUpActive ? "opacity-100 z-[5]" : "opacity-0 z-[1]"
          } ${isSignUpActive ? "sm:translate-x-full" : ""}`}
        >
          <form
            onSubmit={handleSignUp}
            className="bg-white flex items-center justify-center flex-col px-4 sm:px-12 py-6 sm:py-12 h-full text-center"
          >
            <h1 className="font-bold m-0 text-2xl">Create Account</h1>
            <span className="text-xs">or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F3A63]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F3A63]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F3A63]"
              required
            />
            <button
              type="submit"
              className="rounded-full border border-[#2F3A63] bg-[#2F3A63] text-white text-xs font-bold px-11 py-3 uppercase tracking-wider transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none mt-4 hover:bg-[#1e2a4a] hover:border-[#1e2a4a]"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Container */}
        <div
          className={`form-container sign-in-container absolute top-1/2 sm:top-0 h-1/2 sm:h-full transition-all duration-600 ease-in-out left-0 w-full sm:w-1/2 z-[2] ${
            isSignUpActive ? "sm:translate-x-full opacity-0" : ""
          }`}
        >
          <form
            onSubmit={handleSignIn}
            className="bg-white flex items-center justify-center flex-col px-4 sm:px-12 py-6 sm:py-12 h-full text-center"
          >
            <h1 className="font-bold m-0 text-2xl">Sign in</h1>
            <span className="text-xs">Use your registered account</span>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F3A63]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F3A63]"
              required
            />
            <a
              href="#"
              className="text-gray-800 text-sm no-underline my-[15px] block hover:text-[#2F3A63] transition-colors"
            >
              Forgot your password?
            </a>
            <button
              type="submit"
              className="rounded-full border border-[#2F3A63] bg-[#2F3A63] text-white text-xs font-bold px-11 py-3 uppercase tracking-wider transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none hover:bg-[#1e2a4a] hover:border-[#1e2a4a]"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Overlay Panel */}
        <div
          className={`overlay-container absolute top-0 left-0 sm:left-1/2 w-full sm:w-1/2 h-1/2 sm:h-full overflow-hidden transition-transform duration-600 ease-in-out z-[100] ${
            isSignUpActive ? "sm:-translate-x-full" : ""
          }`}
        >
          <div
            className={`overlay bg-gradient-to-r from-[#2F3A63] to-[#2F3A63] relative left-0 sm:left-[-100%] h-full w-full sm:w-[200%] text-white transition-transform duration-600 ease-in-out ${
              isSignUpActive
                ? "sm:translate-x-1/2 translate-x-0"
                : "sm:translate-x-0 translate-x-0"
            }`}
          >
            <div
              className={`overlay-panel overlay-left absolute flex items-center justify-center flex-col px-4 sm:px-10 py-8 sm:py-10 text-center top-0 h-full w-full sm:w-1/2 transition-transform duration-600 ease-in-out ${
                isSignUpActive
                  ? "translate-x-0"
                  : "sm:-translate-x-[20%] -translate-x-full"
              }`}
            >
              <h1 className="font-bold m-0 text-xl sm:text-2xl">
                Welcome Back!
              </h1>
              <p className="text-sm font-light leading-5 tracking-[0.5px] my-5 mb-[30px]">
                To keep connected with us please login with your registered
                account
              </p>
              <button
                className="ghost rounded-full border border-white bg-transparent text-white text-xs font-bold px-11 py-3 uppercase tracking-wider transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none hover:bg-white hover:text-[#2F3A63]"
                onClick={() => {
                  setIsSignUpActive(false);
                  setError("");
                  setSuccessMessage("");
                }}
              >
                Sign In
              </button>
            </div>

            <div
              className={`overlay-panel overlay-right absolute flex items-center justify-center flex-col px-4 sm:px-10 py-8 sm:py-10 text-center top-0 h-full w-full sm:w-1/2 transition-transform duration-600 ease-in-out right-0 sm:right-0 ${
                isSignUpActive
                  ? "sm:translate-x-[20%] translate-x-full"
                  : "translate-x-0"
              }`}
            >
              <h1 className="font-bold m-0 text-xl sm:text-2xl">
                Hello, Friend!
              </h1>
              <p className="text-sm font-light leading-5 tracking-[0.5px] my-5 mb-[30px]">
                Don't have an account? Sign up to get started
              </p>
              <button
                className="ghost rounded-full border border-white bg-transparent text-white text-xs font-bold px-11 py-3 uppercase tracking-wider transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none hover:bg-white hover:text-[#2F3A63]"
                onClick={() => {
                  setIsSignUpActive(true);
                  setError("");
                  setSuccessMessage("");
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;
