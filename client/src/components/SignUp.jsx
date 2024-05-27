import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import GoogleButton from "../auth/GoogleButton";
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

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    // Firstname and Lastname validation
    if (!formData.firstname) {
      newErrors.firstname = "Firstname is required";
    }
    if (!formData.lastname) {
      newErrors.lastname = "Lastname is required";
    }

    return newErrors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsPending(true);
    try {
      const { email, password, firstname, lastname } = formData;
      const response = await Axios.post("http://localhost:3000/auth/signup", {
        email,
        password,
        firstname,
        lastname,
      });
      console.log(response);
      setIsPending(false);
      navigate("/user/");
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        setErrors({ server: error.response.data.message });
      } else if (error.request) {
        console.error("Request data:", error.request);
        setErrors({
          server: "No response from server. Please try again later.",
        });
      } else {
        console.error("Error message:", error.message);
        setErrors({ server: "An error occurred. Please try again." });
      }
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="md:mx-4 mx-8  flex w-full max-w-[500px] flex-col gap-2 md:gap-4"
        onSubmit={handleSignUp}
      >
        <h2 className=" flex text-2xl font-semibold md:justify-normal justify-center">
          Create an account
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="firstname" className="text-sm">
              Firstname
            </label>
            <input
              type="text"
              name="firstname"
              className="input input-bordered"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter your firstname"
            />
            {errors.firstname && (
              <p className="text-red-500">{errors.firstname}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastname" className="text-sm">
              Lastname
            </label>
            <input
              type="text"
              name="lastname"
              className="input input-bordered"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter your lastname"
            />
            {errors.lastname && (
              <p className="text-red-500">{errors.lastname}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="input input-bordered"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <div className="input input-bordered relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              className="pr-4 w-full"
              style={{
                paddingTop: "calc(0.73rem - 1px)",
                paddingBottom: "calc(0.375rem - 1px)",
              }}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          </div>
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="text-sm">
            Confirm Password
          </label>
          <div className="input input-bordered relative">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              className="pr-4 w-full"
              style={{
                paddingTop: "calc(0.73rem - 1px)",
                paddingBottom: "calc(0.375rem - 1px)",
              }}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              {isConfirmPasswordVisible ? (
                <EyeOutlined />
              ) : (
                <EyeInvisibleOutlined />
              )}
            </button>
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
            isPending ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.firstname ||
            !formData.lastname
          }
        >
          {isPending ? "Signing up..." : "Sign up"}
        </button>

        <div className="flex w-full items-center gap-4">
          <div className="w-[30%] sm:w-[35%] border-t border-gray-300"></div>
          <p className="w-full text-center text-[.75rem] opacity-60 md:text-[.875rem]">
            Or sign up with
          </p>
          <div className="w-[30%] sm:w-[35%] border-t border-gray-300"></div>
        </div>

        <GoogleButton />

        <p className="text-center text-sm">
          Have an account?{" "}
          <Link to="/sign-in" className="text-primary-500">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
