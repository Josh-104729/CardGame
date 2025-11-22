import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


export default function PrimaryButton(props) {

  let backgroundImageURL;
  let btnwidth = 80;
  let btnheight = 40;
  let ftsize = 20;
  let ftcolor = 'white';
  switch (props.type) {
    case 'Create':
      backgroundImageURL = 'url(/assets/Button/create_btn.png)';
      btnwidth = 170;
      btnheight = 80;
      ftsize = 35;
      break;
    case 'Search':
      backgroundImageURL = 'url(/assets/Button/search_btn.png)';
      btnwidth = 100;
      btnheight = 35;
      ftsize = 20;
      ftcolor = '#4a1f6d';
      break;
    case 'Entry':
      backgroundImageURL = 'url(/assets/Button/entry_btn.png)';
      btnwidth = 120;
      btnheight = 54;
      ftsize = 25;
      break;
    case 'Userpp':
      backgroundImageURL = 'url(/assets/Button/userpp_btn.png)';
      btnwidth = 90;
      btnheight = 30;
      ftsize = 16;
      ftcolor = '#4a1f6d';
      break;
    case 'Create_room':
      backgroundImageURL = 'url(/assets/Button/createroom_btn.png)';
      btnwidth = 200;
      btnheight = 50;
      ftsize = 20;
      break;
    case 'Cancel':
      backgroundImageURL = 'url(/assets/Button/create_btn.png)';
      btnwidth = 130;
      btnheight = 50;
      ftsize = 20;
      break;
    case 'Start':
      backgroundImageURL = 'url(/assets/Button/start_btn.png)';
      btnwidth = 500;
      btnheight = 172;
      break;
    case 'Shut':
      backgroundImageURL = 'url(/assets/Button/shut_btn.png)';
      btnwidth = 131;
      btnheight = 65;
      ftsize = 30;
      break;
    case 'Pass':
      backgroundImageURL = 'url(/assets/Button/pass_btn.png)';
      btnwidth = 131;
      btnheight = 65;
      ftsize = 30;
      break;
    case 'Exit':
      backgroundImageURL = 'url(/assets/Button/exit_btn.png)';
      btnwidth = 131;
      btnheight = 50;
      ftsize = 20;
      break;
    default:
      break;
  }

  const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
      backgroundColor: "transparent",
      backgroundImage: backgroundImageURL,
      width: btnwidth,
      height: btnheight,
      boxShadow: 'none',
      padding: '1px',
      // visibility: props.visible ? "hidden" : "visible",

      fontFamily: "Fantasy",
      fontSize: ftsize,
      color: ftcolor,
      textTransform: 'capitalize',
      '&:hover': {
        backgroundColor: "transparent",
        filter: 'brightness(120%)',
        fontSize: ftsize + 1,
        boxShadow: 'none',
      },
    }
  }));
  const classes = useStyles();

  return (
    <Button variant="contained" color="primary" style={{ backgroundImage: backgroundImageURL }} className={classes.button} onClick={props.onClick} disabled={props.disabled}>
      {props.content}
    </Button>
  );
}