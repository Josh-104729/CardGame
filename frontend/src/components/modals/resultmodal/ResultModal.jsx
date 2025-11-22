import { makeStyles } from '@material-ui/core';
import React from 'react';
import './ResultModal.css'

const ResultModal = (props) => {

  const { isOpen, setClose, isVictory, previousBounty, updatedBounty } = props;

  const earned = updatedBounty - previousBounty;

  const useStyles = makeStyles(theme => ({
    modalback: {
      opacity: 0.6,
      backgroundColor: 'black',
      width: '100%',
      height: '100%',
      position: 'fixed',
      zIndex: 0,
      visibility: isOpen ? "visible" : "hidden",
    },

    modalmain: {
      zIndex: 1,
      width: 700,
      height: 400,
      position: 'relative',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      backgroundImage: `url(${isVictory ? '/assets/modal/win_bg.png' : '/assets/modal/lost_bg.png'})`,
      animation: isOpen ?'modalappear 0.5s forwards':"",
      visibility: isOpen ? "visible" : "hidden",
    },

    modalletter: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 25,
      textAlign: 'center',
      zIndex: 2,
      position: 'absolute',
      opacity: 0,
      top: '56%',
      animation: isOpen ?'modalletterappear 0.5s 0.5s forwards':"",
      visibility: isOpen ? "visible" : "hidden",
    }
  }));

  const classes = useStyles();

  return (
    <div className="modalcontainer">
      <div className={classes.modalback} onClick={setClose}></div>
      <div className={classes.modalmain}>
        <div className={classes.modalletter}>
          Your bounty is <b>{previousBounty}</b>{earned > 0 ? '+' : '-'}<b>{Math.abs(earned)}</b>=<b>{updatedBounty}</b>
        </div>
      </div>
    </div>
  )
}

export default ResultModal;