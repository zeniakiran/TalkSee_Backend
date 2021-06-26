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
  const classes = useStyles();
  let history = useHistory();
  const { clientSocket } = useContext(SocketContext);
  let uId = JSON.parse(localStorage.getItem("user")).email;
  const {setSocket,roomJoin,messageEvent, friendReq} = useContext(SocketContext);
  let emails = useRef([]);
  //let usersData = useRef([])
  const [usersData, setData] = useState({uData:[]});
  const [lastMsg, setLastMsg] = useState({
    msgs: [],
    msgId: [],
    emails: [],
    types: [],
    senders: [],
    time : []
  });
  const [payload, setPayload] = useState()
  //const [recipients, setRecipients] = useState([])
  let roomId = useRef();
  let count = useRef(0);
  let notPresent = useRef(0);
  roomId.current = "mychats/" + props.match.params.id;
  let recData = [];
  let recMsgs = [];
  let dummy = [];
 let clientSocket1 = useRef()

  window.onload = () => {
    friendReq()
    messageEvent()
    let did = JSON.parse(localStorage.getItem('user'))._id
    roomJoin(did)
    clientSocket1 = io("http://127.0.0.1:5000")
    setSocket((s)=>{
      s = clientSocket1
      s.on('connect' , () => {
        console.log("connected",s.id);
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
        if (data.length > 0) {
          //console.log("emails before sorting", data);
          emails.current = data.sort();
          emails.current = Array.from(new Set(emails.current));
          console.log("emails after sorting", emails.current);
          userservice
            .getUserByEmail({ userArray: emails.current })
            .then((datafromdb) => {
              recData = datafromdb;
              //console.log("recdata", recData);
              setData((d) => {
                d.uData = recData;
                return d;
              });
            });
          // let index = 0
          emails.current.forEach((r, index) => {
            chatservice
              .getLastMsg(uId, r)
              .then((data1) => {
                //console.log("data1", data1);
                if(data1){
                  setLastMsg((msg) => {
                    if (
                      msg.msgs.length >= 1 &&
                      msg.emails.length >= 1 &&
                      msg.types.length >= 1 &&
                      msg.msgId.length >= 1 &&
                      msg.senders.length >= 1
                    ) {
                      let newMsg = [...msg.msgs];
                      let newR = [...msg.emails];
                      let newT = [...msg.types];
                      let id = [...msg.msgId];
                      let sender = [...msg.senders];
                      let newTime = [...msg.time]
                      newMsg = [...newMsg, data1.lastMsg];
                      newR = [...newR, r];
                      newT = [...newT, data1.type];
                      id = [...id, data1.msgId];
                      sender = [...sender, data1.sender];
                      newTime = [...newTime, data1.time]
                      
                      return {
                        ...msg,
                        msgs: newMsg,
                        msgId: id,
                        emails: newR,
                        types: newT,
                        senders: sender,
                        time : newTime
                      };
                    } else {
                      console.log("first: ", data1.lastMsg, r);
                      let myMsg =  {
                        msgs: [data1.lastMsg],
                        msgId: [data1.msgId],
                        emails: [r],
                        types: [data1.type],
                        senders: [data1.sender],
                        time : [data1.time]
                      };
                      console.log("MY MSG: ",myMsg)
                      return myMsg
                    }
                  });
                }

              })
              .catch((err) => console.log(err));
          });

          //setLastMsg(recMsgs)

          //console.log("recipients",recipients)
        } else console.log("no data");
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
    //console.log("usersData 1", usersData);
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
    console.log("IN PAYLOAD")
    if (payload) {
      console.log("payload",payload)
        let index;

        if (usersData.uData.length !== 0 && lastMsg.msgs.length !== 0) {
          console.log("check:", usersData);
          count.current = 0;
          /* present.current =0
        notPresent.current =0 */
          usersData.uData.forEach((u, indx) => {
            //console.log("emails from map", payload.message.from, u.email);
            if (payload.message.from === u.email) {
              index = indx;
              console.log("index: ", index);
              count.current = count.current + 1;
              console.log("count: ", count.current)
              
            } else {
              //count.current.current = notPresent.current + 1 ;
              console.log("false");
            }
          });
          if (count.current !== 0) {
            console.log("before setRecArray",lastMsg.msgs)
            console.log("in setRecArray",count.current);
            setRecArray(
              index,
              payload.message
            );
          } else if (count.current === 0) {
            setNewRecipient(
              payload.message
            );
            console.log("in setNewArray",count.current);
          } else console.log("nothing ", count.current);
        } else {
          console.log("usersData 1", lastMsg);
        }
      //});
    }
  }, [payload]);

  const setRecArray = (index, message) => {
    //if(lastMsg)
    console.log("Last msg array and index",lastMsg.msgs, index )
    let items = []
    items = [...lastMsg.msgs];
    let mtypes = [...lastMsg.types]
    let mTime = [...lastMsg.time]
    console.log("items before change", items);
    items[index] = message.messageBody;
    mtypes[index] = message.type
    mTime[index] = message.time
    console.log("items", items);
    setLastMsg((m) => {
      return { ...m, msgs: items,types: mtypes, time: mTime };
      //}
    });
  };

  const setNewRecipient = (message) => {
    console.log("in new chattt",message.type)
    userservice
      .getUserByEmail({ userEmail: message.from })
      .then((data) => {
        console.log("data",data);
        setData((d) => {
          let obj = { email: message.from, gender : data[0].gender, id : data[0]._id, 
                      name : data[0].firstName + ' '+ data[0].lastName,
                      img : data[0].profileImg }
          let uData = [...d.uData]
          uData = [...uData,obj]
          console.log("u",uData)
          return { ...d, uData}
        });
      })
      if(usersData.uData.length !==0){
        console.log("not first recipient")
        /* setLastMsg((msg) => {
          
            let newMsg = [...msg.msgs];
            let newR = [...msg.emails];
            let newT = [...msg.types];
            let sender = [...msg.senders];
            newMsg = [...newMsg, msg];
            newR = [...newR, rec];
            newT = [...newT, type];
            sender = [...sender, rec];
            let myMsg = {
              ...msg,
              msgs: newMsg,
              emails: newR,
              types: newT,
              senders: sender,
            };
            console.log("My new Msg",myMsg)
            return myMsg
          
        });  */
        setLastMsg({msgs: [...lastMsg.msgs,message.messageBody], emails: [...lastMsg.emails,message.from], 
                  types:[...lastMsg.types,message.type], senders:[...lastMsg.senders,message.from],
                  time : [...lastMsg.time,message.time ]})
      }
      else{
        console.log("first recipient")
        setLastMsg({msgs: [message.messageBody], emails: [message.from], 
                    types:[message.type], senders:[message.from], time:[message.time]})
      }
      
   
      /*chatservice
      .getLastMsg(uId, rec)
      .then((data1) => {
        console.log("data new", data1);
        
          setLastMsg((msg) => {
          let newMsg = [...msg.msgs];
          let newR = [...msg.emails];
          let newT = [...msg.types];
          let id = [...msg.msgId];
          let sender = [...msg.senders];
          newMsg = [...newMsg, data1.lastMsg];
          newR = [...newR, rec];
          newT = [...newT, data1.type];
          id = [...id, data1.msgId];
          sender = [...sender, data1.sender];
          //console.log("newMsg: ", newMsg, newR, newT,id,sender);
          return {
            ...msg,
            msgs: newMsg,
            msgId: id,
            emails: newR,
            types: newT,
            senders: sender,
          };
    });
      }).catch((err)=>console.log(err))
      */
    
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
      {usersData.uData.length !== 0  && lastMsg.msgs.length !==0? (
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
      </Grid>
       </Grid>
    </div>
  );
};
export default AllChats;