import React, { useEffect, useRef, useState,useContext } from "react";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import chatservice from "../../services/ChatService";
import { format } from "timeago.js";
import {SocketContext} from '../../context/SocketContext';

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
   
  listText: {
    fontSize: "1.5rem",
    fontFamily: "Roboto",
    marginLeft: "0.5rem",
    marginTop:"2rem",
    fontWeight:"bold",
    display:"inline"
   
  },
  listText1: {
    fontSize: "1.3rem",
    fontFamily: "Roboto",
    color: "#808284",
    width:"80%",
    marginLeft: "0.5rem",
    display:"block",
    cursor:"pointer",
    overflow:"hidden",
    textOverflow:"ellipsis"
    
    
  },
  listTime:{
    fontSize: "0.8rem",
    fontFamily: "Roboto",
    color: "gray",
    marginLeft: "0.5rem",
    display:"inline"
     
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
  let elem = null;
  let user = JSON.parse(localStorage.getItem("user"));
  let messages = useRef([]);
  const {msgNotify}=useContext(SocketContext);
  
  const recipientClickHandler = (frEmail,frName, frId, frLang, frImg, type) => {
    //console.log("fr",frEmail,frId,frName,frLang,frImg,type)
    chatservice.getMessagesbyEmail(user.email, frEmail).then((res) => {
      messages.current = res;
      messages.current.map((m) => {
        if (m.type === "offline" && m.from !== user.email) {
          chatservice
            .changeMessageType({ type: "read" }, m._id)
            .then((res) => {
              msgNotify();
            })
            .catch((err) => console.log(err));
        }
        console.log("user matched")
      });
    });
    //console.log("fr", fr);
    localStorage.setItem("friendId", frId);
    localStorage.setItem("recName", frName);
    localStorage.setItem("recLang", frLang);
    localStorage.setItem("profileUrl", frImg);
    history.push("/chat/" + frEmail + " " + frId);
  };
  let myElem = null
  let obj = {}
  return (
    <div>
      {props.lastMsg.emails.map((r, ind) => {
        console.log(ind)
        
          if (props.lastMsg.types[ind] === "read") {
            //console.log("in 1",props.lastMsg.msgs[ind])
            obj = {id: props.lastMsg.userId[ind], name: props.lastMsg.userName[ind], 
              lang: props.lastMsg.userLang[ind], img: props.lastMsg.userImg[ind]}
            elem = (
              <div>
                  <Typography
                    className={classes.listText1}
                    onClick={() =>
                      recipientClickHandler(
                        r,
                        props.lastMsg.userName[ind],
                        props.lastMsg.userId[ind],
                        props.lastMsg.userLang[ind],
                        props.lastMsg.userImg[ind],
                        props.lastMsg.types[ind],
                        
                      )
                    }
                  >
                    {props.lastMsg.msgs[ind]}
                    
                  </Typography>
                  <Typography className={classes.listTime}>
                  {format(props.lastMsg.time[ind])}
                  </Typography>
              </div>
              
            );
          } else if (
            props.lastMsg.types[ind] === "offline" &&
            props.lastMsg.senders[ind] !== user.email
          ) {
            //console.log("in 3")
            elem = (
              <div>
              <Typography
             style={{ fontWeight: "bold", color: "black" }}
                className={classes.listText1}
                onClick={() =>
                  recipientClickHandler(
                    r,
                    props.lastMsg.userName[ind],
                    props.lastMsg.userId[ind],
                    props.lastMsg.userLang[ind],
                    props.lastMsg.userImg[ind],
                    props.lastMsg.types[ind]
                  )
                }
              >
                {props.lastMsg.msgs[ind]}
              </Typography>
              <Typography className={classes.listTime}>
                {format(props.lastMsg.time[ind])}
              </Typography>
              </div>
              
            );
          } else {
            console.log("in nothing", props.lastMsg.types[ind]);
             console.log("in nothing1", props.lastMsg.senders[ind]);
            elem = (
              <div>
                <Typography
               //  style={{ fontWeight: "bold", color: "black" }}
                  className={classes.listText1}
                  onClick={() =>
                    recipientClickHandler(
                      r,
                      props.lastMsg.userName[ind],
                      props.lastMsg.userId[ind],
                      props.lastMsg.userLang[ind],
                      props.lastMsg.userImg[ind],
                      props.lastMsg.types[ind],
                    )
                  }
                >
                  {props.lastMsg.msgs[ind]}
                </Typography>
                <Typography className={classes.listTime}>
                    {format(props.lastMsg.time[ind])}
                </Typography>
              </div>
            );
          }
        
        //console.log("last Msg Obj",props.lastMsg)
        return (
             
             <Paper style={{padding:  '12px 10px', marginBottom:"1rem" }}  >
              <Grid container>
               <Grid item xs={1}  >
                  <img src={props.lastMsg.userImg[ind]} alt='img'    style={{ height: "50px", width: "50px", borderRadius: "50%",display:"inline" }}/>
               </Grid>
           <Grid item    xs ={11}  >
              <Typography className={classes.listText}>{props.lastMsg.userName[ind]}</Typography>
                 

                {elem}
           </Grid>
               
               
                
              <div>
                {/*  {setText(r,chatRecipients.lastMsg[index],chatRecipients.msgType[index])}
                {elem}*/
                 }
              </div>
              
          
           </Grid>
          </Paper>
        );
      })}
    </div>
  );
};
export default SingleChat;