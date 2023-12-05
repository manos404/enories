import React, { useEffect, useState } from "react";

import "./App.css";

import "antd/dist/reset.css";
import Map from "./shared/Components/UI Elements/Map";
import { AuthContext } from "./shared//context/auth-context";
import { useCallback } from "react";

const App = () => {
  const [render, setRender] = useState();
  const [data, setData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    try {
      //setRender(0);//////////////////
      const sendRequest = async () => {
        const response = await fetch(
          `https://enories-backend.onrender.com/api/data`
        );
        const responseData = await response.json();
        setData(responseData);
      };
      sendRequest();
    } catch (err) {
      console.log(err);
    }
  }, [render]);

  const position = [36.32, 25.13];

  return (
    <>
      <AuthContext.Provider
        value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
      >
        {data && <Map center={position} data={data} setRender={setRender} />}
      </AuthContext.Provider>
    </>
  );
};
export default App;
