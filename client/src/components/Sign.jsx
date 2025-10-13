import React, { useState } from "react";

const Sign = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  return (
    <div className="bg-[#F3F3F3] flex justify-center items-center flex-col min-h-screen font-sans p-5 pb-12">
      <div className="container bg-white rounded-lg shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)] relative overflow-hidden w-full max-w-3xl min-h-[600px] mx-auto transition-all duration-600 ease-in-out">
        <div
          className={`form-container sign-up-container absolute top-1/2 sm:top-0 h-1/2 sm:h-full transition-all duration-600 ease-in-out left-0 w-full sm:w-1/2 ${
            isSignUpActive ? "opacity-100 z-[5]" : "opacity-0 z-[1]"
          } ${isSignUpActive ? "sm:translate-x-full" : ""}`}
        >
          <form className="bg-white flex items-center justify-center flex-col px-4 sm:px-12 py-6 sm:py-12 h-full text-center">
            <h1 className="font-bold m-0 text-2xl">Create Account</h1>

            <span className="text-xs">or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md"
            />
            <button className="rounded-full border bg-white text-black text-xs font-bold px-11 py-3 uppercase tracking-wider transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none mt-4">
              Sign Up
            </button>
          </form>
        </div>
        <div
          className={`form-container sign-in-container absolute top-1/2 sm:top-0 h-1/2 sm:h-full transition-all duration-600 ease-in-out left-0 w-full sm:w-1/2 z-[2] ${
            isSignUpActive ? "sm:translate-x-full opacity-0" : ""
          }`}
        >
          <form className="bg-white flex items-center justify-center flex-col px-4 sm:px-12 py-6 sm:py-12 h-full text-center">
            <h1 className="font-bold m-0 text-2xl">Sign in</h1>

            <span className="text-xs">or use your account</span>
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-200 border-none p-3 my-2 w-full rounded-md"
            />
            <a
              href="#"
              className="text-gray-800 text-sm no-underline my-[15px] block"
            >
              Forgot your password?
            </a>
            <button className="rounded-full border bg-white text-black  text-xs font-bold px-11 py-3 uppercase tracking-wider transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none">
              Sign In
            </button>
          </form>
        </div>
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
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost rounded-full border border-white bg-transparent text-white text-xs font-bold px-11 py-3 uppercase tracking-wider transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none"
                onClick={() => setIsSignUpActive(false)}
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
                Enter your personal details and start journey with us
              </p>
              <button
                className="ghost rounded-full border border-white bg-transparent text-white text-xs font-bold px-11 py-3 uppercase tracking-wider transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none"
                onClick={() => setIsSignUpActive(true)}
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
