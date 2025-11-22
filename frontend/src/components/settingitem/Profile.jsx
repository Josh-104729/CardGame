import React, { useState } from "react";
import './Item.css';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import RadioButtons from "../../page/createroom/Radiobtn";
import { GENDER_TYPE } from "../../const";
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { getFormatDate } from "../../utils/dateFormat";
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      flex: '1',
      backgroundColor: 'lightgray',
    },
    container: {
        flex: '7',
        display: 'flex',

        flexDirection:'column',
    },
    textField: {
        fontSize:'1rem',
        fontWeight:"Bold",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
    },
    margin: {
        margin: theme.spacing(1),
        fontFamily:"PingFang SC",
        fontWeight:"bold"
      },
  }));



export default function Profile() {

    const classes = useStyles();
    const [gender, setGender] = React.useState('Female');
    const [username,setUsername] = useState('');
    const [date,setDate] = useState('');
    const [email,setEmail] = useState('');

    const handleUpdateProfile = () => {

    }

    return(
        <div className="Profile_Border">
            <div className={classes.root}>
                <List component="nav" aria-label="main mailbox folders">
                        <ListItem>
                            <ListItemText primary="Public Profile"/>
                        </ListItem>
                </List>
            </div>
            <div className={classes.container}>
                <label className={classes.textField}>Username</label>
                <TextField
                    id="filled-full-width"
                    placeholder="Username"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e)=>
                        setUsername(e.target.value)
                    }
                    variant="filled"/>
                <label className={classes.textField}>Email</label>
                <TextField
                    id="filled-full-width"
                    placeholder="Email"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e)=>
                        setEmail(e.target.value)
                    }
                    variant="filled"/>
                <label className={classes.textField}>
                    Gender
                    <RadioButtons text={GENDER_TYPE} setValue={setGender} style={{display:'flex'}}/>
                </label>
                <label className={classes.textField}>
                    Birthday
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="flex-start">
                          <KeyboardDatePicker
                            fullWidth
                            format="MM/dd/yyyy"
                            value={date}
                            onChange={(date) => {
                                const d = getFormatDate(new Date(date));
                                setDate(d);
                            }}
                            KeyboardButtonProps={{
                                "aria-label": "change date",
                            }}
                            />
                        </Grid>
                  </MuiPickersUtilsProvider>
                </label>
                <ThemeProvider>
                    <Button variant="contained" style={{backgroundColor:'#21ba45'}} className={classes.margin} onClick={handleUpdateProfile()}>
                        Update Profile
                    </Button>
                </ThemeProvider>
            </div>
        </div>
    )
}