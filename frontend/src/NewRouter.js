import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Welcome from "./page/welcome/Welcome";
import LuckyMan from "./page/luckyman/LuckyMan";
import CreateRoom from "./page/createroom/CreateRoom";
import Room from "./page/room/Room";
import Setting from "./page/setting/Setting";
import axios from 'axios';
import { DEFAULT_AVATAR } from "./const";
import { Logincontext } from "./components/contexts/Logincontext";
import { CircularProgress } from "@material-ui/core";

function NewRouter() {
  const [isLoading, setLoading] = useState(false);
  const loginContext = useContext(Logincontext);
  const API_URL = process.env?.REACT_APP_API_URL;
  const token = localStorage.getItem("jwtToken");
  let isLoggedIn = !!token;

  useEffect(() => {
    if(token && token !== '------') {
      setLoading(true);
      axios.post(`${API_URL}/validate_token`, { token }).then((res) => {
        if (!res.data.status) {
          // Logout user
          localStorage.removeItem("jwtToken");
          isLoggedIn = false;
        } else {
          isLoggedIn = true;
          loginContext.setUser({
            isLoggedIn: true,
            bounty: res.data.user?.bounty,
            username: res.data.user?.username,
            avatarUrl: res.data.user?.avatar_url ?? DEFAULT_AVATAR
          })
        }
        setLoading(false);
      });
    } else {
      isLoggedIn = false;
    }
  }, [token])

  if (isLoading) {
    return <CircularProgress />
  }
  if (isLoggedIn) {
    return (
      <Switch>
        <Route path="/main" component={Room} />
        <Route path="/luckyman-*" component={LuckyMan} />
        <Route path="/create" component={CreateRoom} />
        <Route path="/setting" component={Setting}/>
        <Redirect to="/main" />
      </Switch>
    );
  }
  return (
    <Router>
      <Route path="/" component={Welcome} />
      <Redirect from="*" to="/" />
    </Router>
  );
}

export default NewRouter;