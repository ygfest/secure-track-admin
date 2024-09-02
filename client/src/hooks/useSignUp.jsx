import { useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../context/AuthContext";

export const useSignup = () => {
  const { dispatch } = useContext(AuthContext);

  const signup = async (formData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.post(`${apiUrl}/auth/signup`, formData);
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
