import React, { useState } from "react";
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
const useStyles = makeStyles((theme) => ({

  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
    transition: theme.transitions.create('width'),
    float:"left",
    color:"black",
    borderRadius: "2rem",
    backgroundColor:"white",
    width:"100%",
    padding:"0.4rem",
  border: "1.4px solid #c4c4c4",
    
  },
  
   
  
}));
export default function TypeMessage(props) {
  const [message, setMessage] = useState("");
  const classes = useStyles();
  return (
    <React.Fragment >
    <Grid container  style={{  display:"flex",paddingTop:"0.5rem" }}> 
    <Grid item xs ={10} sm={11} md={11}> 
     <InputBase
              placeholder="Type a message here"
              className={classes.inputInput}
              inputProps={{ 'aria-label': 'type' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            /></Grid>
    <Grid item xs ={2}  sm={1} md={1}>  <Button variant="contained" size="small" className= "Allbtn" style={{
               backgroundColor:  'rgb(0, 172, 193)',
                color : 'white',
                float:"left",
                  padding:"0.5rem",
                  margin:"0.2rem",
                borderRadius:"0.3rem"}}
              onClick={() => {
              props.sendMessage(message);
              setMessage("");
            }}>
              <SendIcon  style={{marginRight:"0.4rem",fontSize:"0.8rem"}}/>
            Send
          </Button></Grid>
         
      
     </Grid>
              </React.Fragment>
  );
}
