import Axios from "axios";
import React, { createContext, useState } from "react";
import Loginmodal from "../modals/loginmodal/Loginmodal";

export const Logincontext = createContext();

const LoginProvdier = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [roomId,setRoomId] = useState(null);

  const API_Url = process.env.REACT_APP_API_URL;

  const login = async (UserName, Password) => {
    return await Axios.post(`${API_Url}/log_in`, { UserName, Password });
  };

  const register = async (newUser) => {
    return await Axios.post(`${API_Url}/register`, newUser);
  };

  return (
    <Logincontext.Provider
      value={{
        roomId,
        setRoomId,
        user,
        setUser,
        login,
        register,
        setLoginModalOpen,
      }}
    >
      {children}
      <Loginmodal
        isOpen={isLoginModalOpen}
        setIsOpen={() => setLoginModalOpen(false)}
      />
    </Logincontext.Provider>
  );
};

export default LoginProvdier;
