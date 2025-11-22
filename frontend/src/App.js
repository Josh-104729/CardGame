import React from "react";
import "./App.css";
import { Router } from "react-router-dom";
import LoginProvdier from "./components/contexts/Logincontext";
import Axios from "axios";
import SnackBarProvider from "./components/contexts/Snackbarcontext";
import NewRouter from "./NewRouter";
import history from "./history";
import { Provider } from "react-redux";
import { store } from "./components/redux/storeConfig/store";
import { useTranslation } from "react-i18next";
import setAuthToken from "./utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { TOKEN_EXPIRED_TIME, TOKEN_UPDATED_TIME } from "./const";

const API_Url = process.env.REACT_APP_API_URL;
const jwtToken = localStorage.getItem("jwtToken");
// Check for token
if (jwtToken) {
  // Set auth token header auth
  setAuthToken(jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(jwtToken);
  // Check for expired token
  const currentTime = Date.now() / 1000;
  // LogOut Method
  let logOut = () => {
    const UserName = decoded.name;
    Axios.post(`${API_Url}/clear_tk`, { UserName }).then((res) => {
      if (res.data.status) {
        // Logout user
        localStorage.removeItem("jwtToken");
        window.location.replace("/");
      }
    });
  }

  const expire = JSON.parse(localStorage.getItem('expire') || "{}");
  
  if (expire.exp < currentTime) {
    logOut();
  } else {
    // Whenever 5 mins, Add the expired time ++ 
    setInterval(function() {
      expire.exp = Date.now() / 1000 + TOKEN_EXPIRED_TIME;
      localStorage.setItem('expire', JSON.stringify(expire));
    }, TOKEN_UPDATED_TIME * 1000);
    // If don't mouse move for 3 hours
    (function(mouseStopDelay) {
      var timeout;
      document.addEventListener('mousemove', function(e) {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          var event = new CustomEvent("mousestop", {
            detail: {
              clientX: e.clientX,
              clientY: e.clientY
            },
            bubbles: true,
            cancelable: true
          });
          e.target.dispatchEvent(event);
          logOut();
        }, mouseStopDelay);
      });
    }(TOKEN_EXPIRED_TIME * 1000));
  }
}

function App() {
  const { t } = useTranslation();

  if (!process.env?.REACT_APP_API_URL) {
    alert(`${t("ALERT_CONTENT")}`);
    return;
  }
  return (
    <Router history={history}>
      <Provider store={store}>
        <SnackBarProvider>
          <LoginProvdier>
            <NewRouter />
          </LoginProvdier>
        </SnackBarProvider>
      </Provider>
    </Router>
  );
}

export default App;
