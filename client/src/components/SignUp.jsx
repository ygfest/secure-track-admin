import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import GoogleButton from "../auth/GoogleButton";
import { ImSpinner2 } from "react-icons/im";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstname) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    setIsPending(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.post(
        `${apiUrl}/auth/signup`,
        { ...formData },
        { withCredentials: true } // Ensure credentials (cookies) are included
      );

      if (response.data.status) {
        console.log("Navigating to dashboard");
        setIsPending(false);
        navigate("/user");
      } else {
        setErrors({ server: response.data.message });
        setIsPending(false);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setErrors({ server: error.response?.data?.message || "Sign-up failed" });
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="md:mx-4 mx-8 flex w-full max-w-[500px] flex-col gap-4 md:border-2 bg-white md:border-zinc-400 md:border-opacity-25 md:p-8 p-4 rounded-lg"
      >
        <h2 className="flex text-2xl font-semibold justify-center md:justify-normal">
          Create your account
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col">
              <label htmlFor="firstname" className="text-sm mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
              {errors.firstname && (
                <p className="text-red-500">{errors.firstname}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label htmlFor="lastname" className="text-sm mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
              {errors.lastname && (
                <p className="text-red-500">{errors.lastname}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                id="password"
                className="w-full pr-4 input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.password}
                onChange={handleChange}
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
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                className="w-full pr-4 input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {isConfirmPasswordVisible ? (
                <EyeOutlined
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsConfirmPasswordVisible(false)}
                />
              ) : (
                <EyeInvisibleOutlined
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsConfirmPasswordVisible(true)}
                />
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.server && <p className="text-red-500">{errors.server}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !formData.firstname ||
              !formData.lastname ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword ||
              isPending
            }
          >
            {isPending ? (
              <ImSpinner2 className="animate-spin text-2xl text-primary" />
            ) : (
              "Sign up"
            )}
          </button>
        </div>

        <div className="flex w-full items-center gap-4">
          <div className="w-[30%] sm:w-[35%] border-t border-gray-300"></div>
          <p className="w-full text-center text-[.75rem] opacity-60 md:text-[.875rem]">
            Or sign up with
          </p>
          <div className="w-[30%] sm:w-[35%] border-t border-gray-300"></div>
        </div>

        <GoogleButton />

        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
