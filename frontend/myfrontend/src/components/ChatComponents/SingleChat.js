import React, { useEffect, useRef, useState } from "react";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";
import Button from "@material-ui/core/Button";

import "./chat.css";

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
  },
  list: {
    maxHeight: "calc(100vh - 112px)",
    overflowY: "auto",
  },
  avatar: {
    margin: theme.spacing(0, 3, 0, 1),
  },
  listText: {
    fontSize: "1.5rem",
    fontFamily: "Roboto",
    marginLeft: "40px",
  },
  listText1: {
    fontSize: "1.2rem",
    fontFamily: "Roboto",
    color: "gray",
    marginLeft: "40px",
  },
  listBtn: {
    backgroundColor: "rgb(0, 172, 193)",
    color: "white",
    fontSize: "1rem",
  },
  mygrid: {
    marginTop: "50px",
    marginLeft: "350px",
    width: "650px",
  },
  mygrid1: {
    padding: "20px",
  },
  img: {
    width: "4rem",
    height: "4rem",
    borderRadius: "60px",
  },
}));
const SingleChat = (props) => {
  const classes = useStyles();
  let history = useHistory();
  console.log("props",props.recipients)
  console.log("props",props.lastMsg)
  let elem = null;
  let elem1=null

  const recipientClickHandler = (fr,type,id) =>{
    if(type === 'unread'){
      chatservice.changeMessageType({type : 'read'},id)
      .then((res)=>console.log(res))
      .catch((err)=>console.log(err))
    }
    console.log("fr",fr)
    localStorage.setItem("friendId",fr.id)
    localStorage.setItem("recName",fr.name)
    localStorage.setItem("recLang",fr.lang)
    localStorage.setItem("profileUrl",fr.img)
    history.push("/chat/"+fr.email+' '+fr.id)
    
  }
  
  return (
    <div>
      {props.recipients.map((r, index) => {
        console.log("r:",r)
        return (
          <Grid xs={6}>
            <ListItem button >
              <ListItemAvatar>
                <img
                  src={r.img}
                  alt='img'
                  className={classes.img}
               />
              </ListItemAvatar>
              <ListItemText>
                {/*  {setText(r,chatRecipients.lastMsg[index],chatRecipients.msgType[index])}
                {elem}
                 */}
                 
                <Typography className={classes.listText}>
                    {r.name}
                </Typography>
                
                {props.lastMsg.emails.forEach((u,ind)=>{
                    if(u === r.email){
                      console.log(" email from map",u,props.lastMsg.msgs[ind])
                      if(props.lastMsg.types[ind] === 'read'){
                        elem= ( <Typography className={classes.listText1} 
                        onClick={()=>recipientClickHandler(r,props.lastMsg.types[ind],props.lastMsg.msgId[ind])}>
                                  {props.lastMsg.msgs[ind]}
                            </Typography>
                        )
                      }
                      else if(props.lastMsg.types[ind] === 'unread'){
                        elem= ( <Typography style={{fontWeight: 'bold', color: 'black'}} 
                        className={classes.listText1} 
                        onClick={()=>recipientClickHandler(r,props.lastMsg.types[ind],props.lastMsg.msgId[ind])}>
                                  {props.lastMsg.msgs[ind]}
                            </Typography>
                        )
                      }
                    }
                })}
            
                {elem}
              </ListItemText>
              <Divider />
            </ListItem>
            <Divider />
          </Grid>
        );
      })}
    </div>
  );
};
export default SingleChat;
