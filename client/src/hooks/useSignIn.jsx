import { useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../context/AuthContext";

export const useSignin = () => {
  const { dispatch } = useContext(AuthContext);

  const signin = async (formData) => {
    try {
      const response = await Axios.post(
        "http://localhost:3000/auth/signin",
        formData
      );
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
