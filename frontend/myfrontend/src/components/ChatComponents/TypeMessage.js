import React, { useState } from "react";
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    }
  },
  btn:{
    backgroundColor:  'rgb(0, 172, 193)',
    color : 'white',
    float:"right",
    marginTop: "12px"
  }
}));
export default function TypeMessage(props) {
  const [message, setMessage] = useState("");
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className="type_msg">
        <div className="input_msg_write">
        <InputBase
              placeholder="Type a message"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'type' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" className={classes.btn} 
              onClick={() => {
              props.sendMessage(message);
              setMessage("");
            }}>
            Send
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
