import React from 'react';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core';

export default function RadioButtons(props) {
  const [selectedValue, setSelectedValue] = React.useState(0);
  const { text, setValue } = props;

  const useStyles = makeStyles(theme => ({
    label: {
      fontSize: 40,
      fontFamily:'SF Big Whiskey Extended, Helvetica, sans-serif',
      fontWeight:'bold',
    },
    labelArea:{
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:'center',
      margin:30
    }
  }));
  const handleChange = event => {
    setSelectedValue(parseInt(event.target.value));
    setValue(text[parseInt(event.target.value)]);
  };

  const classes = useStyles();
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {text.map((item, index) => {
        return (
          <div className={classes.labelArea} >
            <label className={classes.label}>{item}</label>
            <Radio
              checked={selectedValue === index}
              onChange={handleChange}
              value={index}
              name="radio-button-demo"
            />
          </div>
        )
      })}
    </div>
    
  );
}