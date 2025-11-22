import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function DelayingAppearance(props) {

  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      margin: theme.spacing(2),
    },
    placeholder: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: "center",
    },
    number: {
      textAlign: 'center',
      position: 'fixed',
      fontSize: 50,
      color: "red",
      fontWeight: 'bold',
      opacity: 0.5,
      visibility: props.visible ? "visible" : "hidden",
    },
    circle: {
      visibility: props.visible ? "visible" : "hidden",
      color: "rgba(203,113,242,0.6)",
    }
  }));

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.placeholder}>
        {/* <div className={classes.number}>{10 - props.counterCnt}</div> */}
        <Fade
          in={true}
          unmountOnExit
        >
          <CircularProgress size={90} thickness={22} opacity={100} variant="static" value={100 - props.counterCnt * 10} className={classes.circle} />
        </Fade>
      </div>
    </div>
  );
}
