import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/me");
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch rolle");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { user, isLoading, error };
};
