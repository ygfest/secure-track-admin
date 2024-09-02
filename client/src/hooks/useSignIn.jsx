import { useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../context/AuthContext";

export const useSignin = () => {
  const { dispatch } = useContext(AuthContext);

  const signin = async (formData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.post(`${apiUrl}/auth/signin`, formData);
      const { email, token } = response.data;
      const user = { email, token };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "SIGNIN", payload: user });
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    }
  };

  return { signin };
};
