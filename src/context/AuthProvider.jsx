import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import axios from "axios";

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getProfileUserData(token);
    } else{
      setUserData(null)
    }
  }, [token]);



  
  async function getProfileUserData(token) {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile-data`,
        {
          headers: { token },
        }
      );
      if (data.message == "success") {
        setUserData(data.user);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ token, setToken, userData , getProfileUserData}}>
      {children}
    </AuthContext.Provider>
  );
}
