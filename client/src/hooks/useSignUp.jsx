import { useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../context/AuthContext";

export const useSignup = () => {
  const { dispatch } = useContext(AuthContext);

  const signup = async (formData) => {
    try {
      const response = await Axios.post(
        "http://localhost:3000/auth/signup",
        formData
      );
      const { email, token } = response.data;
      const user = { email, token };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "SIGNUP", payload: user });
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  return { signup };
};

export default { useSignup };
