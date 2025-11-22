import React from "react";
import './Item.css';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
}));

export default function Avatar() {

    const classes = useStyles();

    return (
        <div className="Profile_Border">
            <div className={classes.root}>
                <List component="nav" aria-label="main mailbox folders">
                    <ListItem>
                        <ListItemText primary="Avatar"/>
                    </ListItem>
                </List>
            </div>
            <div className={classes.container}>
            
            </div>            
        </div>
    )
}
