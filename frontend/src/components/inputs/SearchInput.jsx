import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles(theme => ({

    input: {
        backgroundColor: '#cca0e0',
        border: "1px solid #b00ebf",
        borderRadius: "30px",
        boxShadow: "3px 3px 5px #865ba2 inset",
        width: "300px",
        color: "#4a1f6d",
        fontSize: 20,
        paddingLeft: "20px",
        paddingRight: "20px",
    }
}));
export default function SearchInput(props) {
    const classes = useStyles();
    const { searchValue, setSearchValue } = props;
    return (
        <InputBase
            classes={{
                input: classes.input,
            }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
        />
    );
}