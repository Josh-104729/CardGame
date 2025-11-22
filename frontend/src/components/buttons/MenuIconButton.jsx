import React, { useState, useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import Axios from "axios";
import { useTranslation } from 'react-i18next';
import { makeStyles } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import { Logincontext } from "../contexts/Logincontext";
import PrimaryButton from "./PrimaryButton";
import { SnackBarcontext } from "../contexts/Snackbarcontext";

const API_Url = process.env.REACT_APP_API_URL;

export default function MenuIconButton() {
  const { t } = useTranslation();
  const loginContext = useContext(Logincontext);
  const snackBarContext = useContext(SnackBarcontext);

  const [showImage, setShowImage] = useState(false);
  const { username, avatarUrl, bounty } = loginContext.user || {};

  console.log("user is ",loginContext.user);
  const handleIconOpen = () => {
    setShowImage(() => !showImage);
  };

  const handleLogout = async () => {
    await Axios.post(`${API_Url}/clear_tk`, {
      UserName: username
    });
    localStorage.removeItem("jwtToken");
    window.location.href = "/";
  };

  const handleSetting = () => {
    snackBarContext.controlSnackBar('The setting page is developing now. Please wait a month.', "warning");
    // history.push("/setting");

  };

  const useStyles = makeStyles({
    avatar: {
      width: 90,
      height: 90,
      transform: "rotate(45deg)",
      '& img':{
        transform: 'rotate(-45deg) scale(1.25)',
      }
    },
  });

  const classes = useStyles();

  return (
    <div className="userprop column">
      <div className="userpp_avatar_res column" style={{userSelect:'none'}}>
        <img src='/assets/background/userpp_bg.png' alt='avatar background'/>
        <div style={{ zIndex: 0, position: "absolute" }}>
          <IconButton onClick={handleIconOpen}>
            <Avatar variant="square" src={avatarUrl} alt="" className={[classes.avatar, classes.scalavatar]} />
          </IconButton>
        </div>
      </div>
      <div className='userpp_button userpp_button_res row'>
        <PrimaryButton content={`${t('MENUITEM_SETTING_BUTTON')}`} onClick={handleSetting} type='Userpp' />
        <div style={{ width: '45px' }}></div>
        <PrimaryButton content={`${t('MENUITEM_LOGOUT_BUTTON')}`} onClick={handleLogout} type='Userpp' />
      </div>
      <div className='userpp_effect userpp_effect_res' />
      <div className="userpp_name userpp_name_res" style={{userSelect:'none'}}>{username}</div>
      <div className="row userpp_bounty_res">
        <img src={'/gold.png'} alt='diamond' style={{ width: "30px", height: "30px", marginRight: "10px",userSelect:'none' }} />
        <div style={{ color: "#7bd1f9", fontWeight: "bold", fontSize: "30px",userSelect:'none' }}>{bounty}</div>
      </div>
    </div>
  );
}