import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      dispatch({ type: "LOGIN", payload: res.data });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
