import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import GoogleButton from "../auth/GoogleButton";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import TokenExpirationAlert from "./TokenExpirationAlert";

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSigningIn(true);
    try {
      const { email, password } = formData;
      const apiUrl = import.meta.env.VITE_API_URL;

      const headers = {
        "Content-Type": "application/json", // Ensure the Content-Type is set
        "Custom-Header": "YourHeaderValue", // Add your custom headers here
      };

      // Using fetch to replace Axios
      const response = await fetch(`${apiUrl}/auth/signin`, {
        method: "POST",
        credentials: "include", // Equivalent to Axios's withCredentials: true
        headers: headers,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status) {
        console.log("Navigating HAHAHA");
        setIsSigningIn(false);
        if (data.user.role === "user") {
          navigate("/user");
        } else if (data.user.role === "admin") {
          navigate("/admin");
        }
      } else {
        setErrors({ server: data.message });
        setIsSigningIn(false);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setIsSigningIn(false);

      if (error instanceof TypeError) {
        // Handle fetch-specific errors (like network issues)
        setErrors({
          server: "No response from server. Please try again later.",
        });
      } else {
        setErrors({ server: "An error occurred. Please try again." });
      }
    }
  };

  return (
    <>
      {sessionExpired && (
        <TokenExpirationAlert onOkClick={() => setSessionExpired(false)} />
      )}
      <div className="flex items-center justify-center min-h-screen bg-white">
        <form
          onSubmit={handleSubmit}
          className="md:mx-4 mx-8 flex w-full max-w-[500px] flex-col gap-2 md:gap-4 bg-white  md:border-2 md:border-zinc-400 md:border-opacity-25 p-4 md:p-8 rounded-lg z-[50]"
        >
          <h2 className="flex text-2xl font-semibold justify-center md:justify-normal">
            Sign in to your account
          </h2>
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                className="w-full pr-4 input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                style={{
                  paddingTop: "calc(0.675rem - 1px)",
                  paddingBottom: "calc(0.375rem - 1px)",
                }}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
              />
              {isPasswordVisible ? (
                <EyeOutlined
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsPasswordVisible(false)}
                />
              ) : (
                <EyeInvisibleOutlined
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsPasswordVisible(true)}
                />
              )}
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}

            {errors.server && <p className="text-red-500">{errors.server}</p>}

            <p className="text-sm">
              <Link to="/forgot-password" className="text-primary-500">
                Forgot Password?
              </Link>
            </p>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formData.email || !formData.password || isSigningIn}
            >
              {isSigningIn ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="flex w-full items-center gap-4">
            <div className="w-[30%] sm:w-[35%] border-t border-gray-300"></div>
            <p className="w-full text-center text-[.75rem] opacity-60 md:text-[.875rem]">
              Or sign in with
            </p>
            <div className="w-[30%] sm:w-[35%] border-t border-gray-300"></div>
          </div>

          <GoogleButton />

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary font-bold">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
