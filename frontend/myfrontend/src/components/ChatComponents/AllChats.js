import React, { useEffect, useRef, useContext, useState } from "react";
import io from "socket.io-client";
import { SocketContext } from "../../context/SocketContext";
import SingleChat from "./SingleChat";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../FrontendComponents/components/pageTitle";
import Header from "../FrontendComponents/components/Header";
import { useHistory } from "react-router-dom";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";
import "./chat.css";
import { Grid, Hidden } from "@material-ui/core";
import SideBar from "../FrontendComponents/components/SideBar";

const useStyles = makeStyles((theme) => ({
  mygrid: {
    marginTop: "50px",
    marginLeft: "350px",
    width: "650px",
  },
}));
const AllChats = (props) => {
 
  const { clientSocket } = useContext(SocketContext);
  let uId = JSON.parse(localStorage.getItem("user")).email;
  const {setSocket,roomJoin,messageEvent, friendReq} = useContext(SocketContext);
  let emails = useRef([]);
  const [usersData, setData] = useState({uData:[]});
  const [lastMsg, setLastMsg] = useState({
    msgs: [],
    msgId: [],
    emails: [],
    types: [],
    senders: [],
    time : [],
    userName :[],
    userImg: [],
    userId: [],
    userLang:[]
  });
  const [payload, setPayload] = useState()
  
  let roomId = useRef();
  let count = useRef(0);
  roomId.current = "mychats/" + props.match.params.id;
  const [loading,setLoading]=useState(false);
 let clientSocket1 = useRef()

  window.onload = () => {
    friendReq()
    messageEvent()
    let did = JSON.parse(localStorage.getItem('user'))._id
    roomJoin(did)
    clientSocket1 = io(process.env.REACT_APP_IP_URL)
    setSocket((s)=>{
      s = clientSocket1
      s.on('connect' , () => {
        s.emit("adduser",{id:s.id, name: uId})

      });
      return s;
    })
  };
  const getRecData = (uId) => {
    emails.current = []
    lastMsg.msgs = []; lastMsg.msgId = []; lastMsg.emails = []; 
    lastMsg.types = []; lastMsg.senders = []; lastMsg.time = []; 
    chatservice
      .getChatRecipients(uId)
      .then((data) => { 
        
        if (data.length > 0 && data !== 'No messages from current email') {
          emails.current = data.sort();
          emails.current = Array.from(new Set(emails.current));
          /* userservice
            .getUserByEmail({ userArray: emails.current })
            .then((datafromdb) => {
              recData = datafromdb;
              //console.log("recdata", recData);
              setData((d) => {
                d.uData = recData;
                return d;
              });
            }); */
          // let index = 0
          emails.current.forEach((r, index) => {
            chatservice
              .getLastMsg(uId, r)
              .then((data1) => {
               // console.log("my data1", data1);
                if(data1){
                  setLastMsg((msg) => {
                   // console.log("msg",msg)
                    if (
                      msg.msgs.length >= 1 &&
                      msg.emails.length >= 1 &&
                      msg.types.length >= 1 &&
                      msg.msgId.length >= 1 &&
                      msg.senders.length >= 1 &&
                      msg.userName.length >=1 && msg.userImg.length >=1
                      && msg.userId.length >=1
                    ) {
                      let newMsg = [...msg.msgs];
                      let newR = [...msg.emails];
                      let newT = [...msg.types];
                      let id = [...msg.msgId];
                      let sender = [...msg.senders];
                      let newTime = [...msg.time]
                      let uName = [...msg.userName]
                      let uImg = [...msg.userImg]
                      let uLang= [...msg.userLang]
                      let uId=[...msg.userId]

                      newMsg = [...newMsg, data1.lastMsg];
                      newR = [...newR, r];
                      newT = [...newT, data1.type];
                      id = [...id, data1.msgId];
                      sender = [...sender, data1.sender];
                      newTime = [...newTime, data1.time]
                      uName =[...uName,data1.userName]
                      uImg=[...uImg,data1.img]
                      uLang=[...uLang, data1.lang]
                      uId=[...uId,data1.id]

                      return {
                        ...msg,
                        msgs: newMsg,
                        msgId: id,
                        emails: newR,
                        types: newT,
                        senders: sender,
                        time : newTime,
                        userName : uName,
                        userImg : uImg,
                        userId: uId,
                        userLang: uLang
                      };
                    } else {
                      
                      let myMsg =  {
                        msgs: [data1.lastMsg],
                        msgId: [data1.msgId],
                        emails: [r],
                        types: [data1.type],
                        senders: [data1.sender],
                        time : [data1.time],
                        userName : [data1.userName],
                        userImg : [data1.img],
                        userId: [data1.id],
                        userLang: [data1.lang]
                      };
      
                      return myMsg
                    }
                  });
                }
                setLoading(true) 
              })
              .catch((err) => console.log(err));
              
          });

          //setLastMsg(recMsgs)
        
          //console.log("recipients",lastMsg)
        } else {setLoading(true); console.log("no data")};
         
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    count.current = 0
    if (clientSocket) {
      clientSocket.emit(
        "myChatsRoom",
        { myChatsRoom: roomId.current },
        ({ error, room }) => {
          if (!error) {
            console.log("joined room with id", room);
          } else {
            console.log("error joining room", error);
          }
        }
      );
    }
    //console.log("in useEffect 1");
    getRecData(uId);
    console.log("usersData 1", props.users);
  }, []);

  useEffect(()=>{
    if (clientSocket) {
      clientSocket.on("newRecipient", (payload) => {
        setPayload((p)=>{
          return p = payload
        })
      })
    }
  },[])

  useEffect(() => {
    if (payload) {
        let index;

        if (lastMsg.emails.length !== 0) {
          count.current = 0;
          /* present.current =0
        notPresent.current =0 */
          lastMsg.emails.forEach((u, indx) => {
            //console.log("emails from map", payload.message.from, u.email);
            if (payload.message.from === u) {
              index = indx;
              count.current = count.current + 1;
              
            } else {
              //count.current.current = notPresent.current + 1 ;
              console.log("false");
            }
          });
          if (count.current !== 0) {
            setRecArray(
              index,
              payload.message
            );
          } else if (count.current === 0) {
            setNewRecipient(
              payload.message
            );
          } else console.log("nothing ", count.current);
        } else {
          console.log("usersData 1", lastMsg);
        }
      //});
    }
  }, [payload]);

  const setRecArray = (index, message) => {
    //console.log(lastMsg,usersData)
    let items = []
    items = [...lastMsg.msgs];
    //let email = [...lastMsg.emails]
    let mtypes = [...lastMsg.types]
    let mTime = [...lastMsg.time]
    //let sender = [...lastMsg.senders]
    items[index] = message.messageBody;
    mtypes[index] = message.type
    mTime[index] = message.time
    //sender[index] = message.from
    //email[index] = message.from
    //email = email.sort()
    setLastMsg((m) => {
      
      //return { ...m, msgs: items, emails: email, types: mtypes, time: mTime, senders: sender };
      return { ...m, msgs: items, types: mtypes, time: mTime};
     
    });
  };

  const setNewRecipient = (message) => {
    console.log("in new chattt",message.type)
    userservice
      .getUserByEmail({ userEmail: message.from })
      .then((data) => {
        console.log("dataa",data)
        setLastMsg((msg) => {
          console.log("msg",msg)
          if (msg.emails.length >= 1) {
        
            return {
              ...msg, msgs: [...msg.msgs,message.messageBody ], emails: [...msg.emails,message.from], 
              types: [...msg.types,message.type], senders: [...msg.senders,message.from], time : [...msg.time,message.time],
              userName : [...msg.userName,data[0].firstName + ' ' + data[0].lastName], userImg : [...msg.userImg,data[0].profileImg],
              userId: [...msg.userId,data[0]._id], userLang: [...msg.userLang,data[0].langPreference]
            };
          }
          else {
                      
            let myMsg =  {
              msgs: [message.messageBody], emails: [message.from], types: [message.type],senders: [message.from],
              time : [message.time], userName : [data[0].firstName + ' ' + data[0].lastName],userImg : [data[0].profileImg],
              userId: [data[0]._id],userLang: [data[0].langPreference]
            };

            return myMsg
          }
          
        })
      })
      
   
    
  };

  return (
    <div  style={{height:"100vh"}} className="back_divs">
    <Grid container>
       <Hidden only={['xs', 'sm']}>
      <Grid item xs ={5} md={2}><SideBar/></Grid>
      </Hidden>
        <Hidden only={['md', 'lg']}>
      <Grid item xs={12} ><Header/></Grid>
      </Hidden>
   <Grid item xs={12} md={10}>
  <PageTitle name={"My Chats"} />
  {loading?
  <div>
    
  {lastMsg.msgs.length !==0 ? (
    <div>
        <Grid container   style={{marginTop:"0.9rem" }}>
      <Grid item xs ={1} md={1}> </Grid>
      <Grid item xs ={10} md={10}>
      <SingleChat recipients={usersData.uData} lastMsg={lastMsg} />
     
    </Grid>
    <Grid item xs ={1} md={1}> </Grid>
    </Grid>
    </div>
  ) : (
    
    <h5 style={{ textAlign: "center" }}>No Chats Yet!</h5>
    
  )}
  </div>:
      <div class="d-flex justify-content-center">
         <strong style={{marginRight:"1rem"}}>Loading...</strong>
  <div class="spinner-border" role="status">
  </div>
</div>
}
  </Grid>
   </Grid>
</div>
  );
};
export default AllChats;

