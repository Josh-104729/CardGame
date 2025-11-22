import { makeStyles } from '@material-ui/core';
import React from 'react';
import './Effect.css'

const TaSoEffect = (props) => {

    const { isOpen, kind } = props;

    const useStyles = makeStyles(theme => ({
        effectmain: {
            zIndex: 1,
            width: 400,
            height: 400,
            position: 'relative',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'center',
            animation: isOpen ? 'effectappear 2s forwards' : "",
            opacity: 0,
            visibility: isOpen ? "visible" : "hidden",
        },
    }));

    const classes = useStyles();

    return (
        <div className="modalcontainer">
            <img className={classes.effectmain} src={`/assets/effects/${kind}.png`} alt={kind} />
        </div>
    )
}

export default TaSoEffect;