import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import './Setting.css';
import Profile from "../../components/settingitem/Profile";
import Avatar from "../../components/settingitem/Avatar";

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }));
  
export default function Setting() {

    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(1);
  
    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };
  
    return (
        <div className="Contain">
            <div className="Nav">
                <div className={classes.root}>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItem
                        selected={selectedIndex === 0}
                        >
                        <ListItemText primary="Setting"/>
                        </ListItem>
                    </List>
                    <Divider />
                    <List component="nav" aria-label="secondary mailbox folder">
                        <ListItem
                        button
                        selected={selectedIndex === 1}
                        onClick={event => handleListItemClick(event, 1)}
                        >
                        <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem
                        button
                        selected={selectedIndex === 2}
                        onClick={event => handleListItemClick(event, 2)}
                        >
                        <ListItemText primary="Avatar" />
                        </ListItem>
                        <ListItem
                        button
                        selected={selectedIndex === 3}
                        onClick={event => handleListItemClick(event, 3)}
                        >
                        <ListItemText primary="Password" />
                        </ListItem>
                        <ListItem
                        button
                        selected={selectedIndex === 4}
                        onClick={event => handleListItemClick(event, 4)}
                        >
                        <ListItemText primary="Gold" />
                        </ListItem>
                        <ListItem
                        button
                        selected={selectedIndex === 5}
                        onClick={event => handleListItemClick(event, 5)}
                        >
                        <ListItemText primary="Delete Account" />
                        </ListItem>
                    </List>
                </div>
            </div>
            <div className="Content">
                {
                    selectedIndex === 1 && <Profile/>
                }
                {
                    selectedIndex === 2 && <Avatar/>
                }
            </div>
        </div>
    );
}