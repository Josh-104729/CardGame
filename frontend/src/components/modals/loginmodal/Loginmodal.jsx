import React, { useContext, useState, useRef } from "react";
import { makeStyles, createStyles, ThemeProvider } from "@material-ui/core/styles";
import { Avatar, Button, createMuiTheme } from "@material-ui/core";
import jwt_decode from "jwt-decode";
import Modal from "@material-ui/core/Modal";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AccountCircle from "@material-ui/icons/AccountCircle";
import "./Loginmodal.css";
import { Logincontext } from "../../contexts/Logincontext";
import { SnackBarcontext } from "../../contexts/Snackbarcontext";
import { useTranslation } from "react-i18next";
import { getFormatDate } from "../../../utils/dateFormat";
import Axios from "axios";
import { DEFAULT_AVATAR } from "../../../const";

export default function Loginmodal(props) {
  const { t } = useTranslation();

  const loginContext = useContext(Logincontext);
  const snackBarContext = useContext(SnackBarcontext);

  const API_Url = process.env.REACT_APP_API_URL;
  const [file, setFile] = useState(''); // storing the uploaded file
  const el = useRef(); // accesing input element

  const [isLogInMode, setLogInMode] = useState(false);

  const [values, setValues] = React.useState({
    Name: "",
    Gender: t("REGISTER_MODAL_SELECT_GENDER_FEMALE"),
    BirthDay: "1/1/1990",
    Email: "",
    Username: "",
    Cardid: "",
    Password: "",
    AllowedByAdmin: 1,
    confirmpassword: "",
    showPassword: false,
    AvatarUrl: "",
  });

  const handleChange = (e) => {
    const file = e.target.files[0]; // accesing file
    setFile(file); // storing file
  }

  const tryRegister = async (userValues) => {
    loginContext
      .register(userValues)
      .then((res) => {
        const { variant, msg } = res.data;
        snackBarContext.controlSnackBar(msg, variant);
        if (variant !== "warning") {
          setLogInMode(false);
          setValues({
            Name: "",
            Gender: t("REGISTER_MODAL_SELECT_GENDER_FEMALE"),
            BirthDay: "1/1/1990",
            Email: "",
            Username: "",
            Cardid: "",
            Password: "",
            AllowedByAdmin: 0,
            confirmpassword: "",
            showPassword: false,
            AvatarUrl: null
          })
        }
      })
      .catch((_err) => {
        snackBarContext.controlSnackBar(t("ERROR_FROM_THE_SERVER"), "error");
      });
  }
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClose = () => {
    props.setIsOpen();
    setLogInMode(false);
    setValues({
      Name: "",
      Gender: t("REGISTER_MODAL_SELECT_GENDER_FEMALE"),
      BirthDay: "1/1/1990",
      Email: "",
      Username: "",
      Cardid: "",
      Password: "",
      AllowedByAdmin: 0,
      confirmpassword: "",
      AvatarUrl: null
    })
  };

  const handleClickShowPassword = () => {
    setShowPassword(() => !showPassword)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(() => !showConfirmPassword)
  };

  const validateFields = () => {
    if (!values.Name && isLogInMode) {
      snackBarContext.controlSnackBar(t("REGISTER_VALIDATION_NO_NAME"), "warning");
      return false;
    }
    if (!values.Username) {
      snackBarContext.controlSnackBar(t("REGISTER_VALIDATION_NO_USERNAME"), "warning");
      return false;
    }
    if (!values.Email && isLogInMode) {
      snackBarContext.controlSnackBar(t("REGISTER_VALIDATION_NO_EMAIL"), "warning");
      return false;
    }
    if (!values.Password) {
      snackBarContext.controlSnackBar(t("REGISTER_VALIDATION_NO_PASSWORD"), "warning");
      return false;
    }
    if (!values.confirmpassword && isLogInMode) {
      snackBarContext.controlSnackBar(t("REGISTER_VALIDATION_NO_CONFIRM_PASSWORD"), "warning");
      return false;
    }
    if (values.Password !== values.confirmpassword && isLogInMode) {
      snackBarContext.controlSnackBar(t("REGISTER_VALIDATION_NO_MATCH"), "warning");
      return false;
    }
    return true;
  }

  const onSubmit = async () => {
    const validation = validateFields();
    if (!validation) return;
    let user = {
      Name: values.Name,
      Gender: values.Gender,
      BirthDay: values.BirthDay,
      Email: values.Email,
      UserName: values.Username,
      Password: values.Password,
      Cardid: values.Cardid,
      AllowedByAdmin: 1,
      AvatarUrl: null,
    };
    if (!isLogInMode)
      loginContext
        .login(user.UserName, user.Password)
        .then((res) => {
          snackBarContext.controlSnackBar(res.data.msg, res.data.variant);
          if (res.data.variant === "success") {
            localStorage.setItem("jwtToken", res.data.token);
            loginContext.setUser({
              isLoggedIn: true,
              bounty: res.data.bounty,
              username: res.data.username,
              avatarUrl: res.data.avatar ?? DEFAULT_AVATAR
            })
            const decode = jwt_decode(res.data.token);
            localStorage.setItem(
              "expire",
              JSON.stringify({
                exp: decode.exp,
                iti: decode.iti,
              })
            );
            handleClose();
            // !!! Refactor Needed !!!
            window.location.href = "/main";
          }
        })
        .catch((_err) => {
          snackBarContext.controlSnackBar(t("ERROR_FROM_THE_SERVER"), "error");
        });
    else {
      if (file) {
        const formData = new FormData();
        formData.append('file', file); // appending file
        const temp = await Axios.post(`${API_Url}/upload`, formData);
        if (temp.data.success) {
          setValues(values => ({
            ...values,
            AvatarUrl: temp.data.path
          }))
          tryRegister({
            ...user,
            AvatarUrl: temp.data.path
          })
        }
      } else {
        tryRegister(user);
      }
    }
  };

  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        '& label.Mui-focused': {
          color: 'white',
        },
        '& label': {
          color: 'white',
        },
        '& input': {
          color: 'white',
        },
        '& button': {
          color: 'white',
        },
        // '& .MuiInput-underline:before': {
        //   borderBottomColor: '#ff5ddf',
        // },
      },
      modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      paper: {
        position: "absolute",
        width: 400,
        border: '2px solid #ff5ddf',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(1, 5),
        "@media only screen and (max-width: 768px)": {
          width: "80%",
        }
      },
      margin: {
        marginTop: theme.spacing(2),
      },
      margin_avartar: {
        display: "flex",
        flexDirection: "row",
        marginTop: theme.spacing(2),
      },
    })
  );

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#ff5ddf',
      },
    },
  });

  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={classes.modal}
      open={props.isOpen}
      onClose={handleClose}
    >
      <div className={classes.paper}>
        <h2 id="simple-modal-title" style={{ color: "#ff5ddf" }}>
          {isLogInMode
            ? `${t("REGISTER_MODAL_TITLE")}`
            : `${t("LOGIN_MODAL_TITLE")}`}
        </h2>
        <ThemeProvider theme={theme}>
          <div className="input">
            <div className={classes.margin}>
              {isLogInMode && (
                <FormControl className={classes.margin_avartar}>
                  <InputLabel htmlFor="standard-adornment-name" style={{ color: 'white' }}>{`${t(
                    "REGISTER_MODAL_NAME_PLACEHOLDER"
                  )}`}</InputLabel>
                  <Input
                    id="standard-adornment-name"
                    value={values.Name}
                    className={classes.root}
                    onChange={(e) =>
                      setValues({ ...values, Name: e.target.value })
                    }
                    fullWidth
                  />
                  <label htmlFor="input-file" style={{ cursor: "pointer" }}>
                    {file && (
                      <div>
                        <img
                          alt=""
                          width="40px"
                          height="40px"
                          src={URL.createObjectURL(file)}
                        >
                        </img>
                      </div>
                    )}
                    {!file && (
                      <div>
                        <Avatar src={loginContext.avatarsrc} />
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="input-file"
                    ref={el}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                </FormControl>
              )}
              {isLogInMode && (
                <FormControl component="fieldset" className={classes.margin}>
                  <RadioGroup
                    aria-label="gender"
                    name="gender"
                    value={values.Gender}
                    className={classes.root}
                    onChange={(e) =>
                      setValues({ ...values, Gender: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value={t("REGISTER_MODAL_SELECT_GENDER_FEMALE")}
                      control={<Radio color="primary" />}
                      label={t("REGISTER_MODAL_SELECT_GENDER_FEMALE")}
                    />
                    <FormControlLabel
                      value={t("REGISTER_MODAL_SELECT_GENDER_MALE")}
                      control={<Radio color="primary" />}
                      label={t("REGISTER_MODAL_SELECT_GENDER_MALE")}
                    />
                    <FormControlLabel
                      value={t("REGISTER_MODAL_SELECT_GENDER_Other")}
                      control={<Radio color="primary" />}
                      label={t("REGISTER_MODAL_SELECT_GENDER_Other")}
                    />
                  </RadioGroup>
                </FormControl>
              )}
              {isLogInMode && (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="flex-start">
                    <KeyboardDatePicker
                      className={classes.root}
                      fullWidth
                      margin="none"
                      id="date-picker-dialog"
                      label={`${t("REGISTER_MODAL_BIRTHDAY_PLACEHOLDER")}`}
                      format="MM/dd/yyyy"
                      value={values.BirthDay}
                      onChange={(date) => {
                        const d = getFormatDate(new Date(date));
                        return setValues({ ...values, BirthDay: d })
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              )}
              {isLogInMode && (
                <FormControl fullWidth className={classes.margin}>
                  <InputLabel htmlFor="standard-adornment-email" style={{ color: 'white' }}>{`${t(
                    "REGISTER_MODAL_EMAL_PLACEHOLDER"
                  )}`}</InputLabel>
                  <Input
                    id="standard-adornment-email"
                    value={values.Email}
                    className={classes.root}
                    onChange={(e) =>
                      setValues({ ...values, Email: e.target.value })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton style={{ color: 'white'}} disabled>
                          <MailOutlineIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              )}
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-username" style={{ color: 'white' }}>{`${t(
                  "LOGIN_MODAL_USER_NAME_PLACEHOLDER"
                )}`}</InputLabel>
                <Input
                  id="standard-adornment-username"
                  value={values.Username}
                  className={classes.root}
                  onChange={(e) =>
                    setValues({ ...values, Username: e.target.value })
                  }
                  endAdornment={
                    <InputAdornment position="end" >
                      <IconButton style={{ color: 'white' }} disabled>
                        <AccountCircle />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-password" style={{ color: 'white' }}>{`${t(
                  "LOGIN_MODAL_PASSWORD_PLACEHOLDER"
                )}`}</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={values.Password}
                  className={classes.root}
                  onChange={(e) =>
                    setValues({ ...values, Password: e.target.value })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        style={{ color: 'white' }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {isLogInMode && (
                <FormControl fullWidth className={classes.margin}>
                  <InputLabel htmlFor="standard-adornment-confirmpassword" style={{ color: 'white' }}>{`${t(
                    "REGISTER_MODAL_CONFIRM_PASSWORD_PLACEHOLDER"
                  )}`}</InputLabel>
                  <Input
                    id="standard-adornment-confirmpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmpassword}
                    className={classes.root}
                    onChange={(e) =>
                      setValues({ ...values, confirmpassword: e.target.value })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          className={classes.root}
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              )}
            </div>
          </div>

          <div className="buttongroup">
            <div className="button">
              <Button onClick={onSubmit} color="primary" variant='outlined' size="large">{`${t(
                "LOGIN_MODAL_OK_BUTTON"
              )}`}</Button>
            </div>
            <div className="button">
              <Button onClick={handleClose} color="primary" variant='outlined' size="large">{`${t(
                "LOGIN_MODAL_CANCEL_BUTTON"
              )}`}</Button>
            </div>

            {!isLogInMode && (
              <div className="button">
                <Button
                  onClick={() => setLogInMode(() => !isLogInMode)}
                  color="primary" variant='outlined'
                  size="large"
                >{`${t("LOGIN_MODAL_REGISTER_BUTTON")}`}</Button>
              </div>
            )}
          </div>
        </ThemeProvider>
      </div>
    </Modal>
  );
}
