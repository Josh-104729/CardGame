import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  }
}));

export default function LoginIconButton(props) {
  const classes = useStyles();
  return (
      <div>
        <Fab color="primary" aria-label="add" className={classes.margin} onClick={props.showModal}>
          <PersonAddIcon />
        </Fab>
      </div>
  );
}
