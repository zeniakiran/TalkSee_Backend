import React, { useEffect, useRef, useContext, useState } from "react";
import { MyChatsContext } from "../../context/MyChatsContext";
import { SocketContext } from "../../context/SocketContext";
import SingleChat from "./SingleChat";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import PageTitle from "../FrontendComponents/components/pageTitle";
import Header from "../FrontendComponents/components/Header";
import { useHistory } from "react-router-dom";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";

import "./chat.css";

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
  /* const [email,setEmail]= useState([])
  const [lastMsg,setlastMsg]= useState([])
  const [id,setId]= useState([])
  const [url,setUrl]= useState([])
  const [name,setName]= useState([]) */
  let emails = useRef([]);
  //let usersData = useRef([])
  const [usersData, setData] = useState({uData:[]});
  const [lastMsg, setLastMsg] = useState({
    msgs: [],
    msgId: [],
    emails: [],
    types: [],
    senders: [],
  });
  const [newMsg, setNewMsg] = useState({msg:[]})
  //const [recipients, setRecipients] = useState([])
  let roomId = useRef();
  let count = useRef(0);
  let notPresent = useRef(0);
  roomId.current = "mychats/" + props.match.params.id;
  let recData = [];
  let recMsgs = [];
  let dummy = [];

  const getRecData = (uId) => {
    chatservice
      .getChatRecipients(uId)
      .then((data) => {
        if (data.length > 0) {
          console.log("emails before sorting", data);
          emails.current = data.sort();
          console.log("emails after sorting", emails.current);
          /* setRecipients((r)=>{
            r.email = emails.current
            //console.log("r emails", r)
          }) */
          //console.log("data",emails)
          userservice
            .getUserByEmail({ userArray: emails.current })
            .then((datafromdb) => {
              recData = datafromdb;
              console.log("recdata", recData);
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
                console.log("data1", data1);
                if(data1){
                  setLastMsg((msg) => {
                    console.log("msg", msg);
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
                      newMsg = [...newMsg, data1.lastMsg];
                      newR = [...newR, r];
                      newT = [...newT, data1.type];
                      id = [...id, data1.msgId];
                      sender = [...sender, data1.sender];
                      console.log("newMsg: ", newR);
                      return {
                        ...msg,
                        msgs: newMsg,
                        msgId: id,
                        emails: newR,
                        types: newT,
                        senders: sender,
                      };
                    } else {
                      console.log("first: ", data1.lastMsg, r);
                      return {
                        msgs: [data1.lastMsg],
                        msgId: [data1.msgId],
                        emails: [r],
                        types: [data1.type],
                        senders: [data1.sender],
                      };
                    }
                  });
                }

                /* setLastMsg((msg) => {
                  console.log("msg", msg);
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
                    newMsg = [...newMsg, data1.lastMsg];
                    newR = [...newR, r];
                    newT = [...newT, data1.type];
                    id = [...id, data1.msgId];
                    sender = [...sender, data1.sender];
                    console.log("newMsg: ", newR);
                    return {
                      ...msg,
                      msgs: newMsg,
                      msgId: id,
                      emails: newR,
                      types: newT,
                      senders: sender,
                    };
                  } else {
                    console.log("first: ", data1.lastMsg, r);
                    return {
                      msgs: [data1.lastMsg],
                      msgId: [data1.msgId],
                      emails: [r],
                      types: [data1.type],
                      senders: [data1.sender],
                    };
                  }
                }); */
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
    console.log("in useEffect 1");
    getRecData(uId);
    console.log("usersData 1", usersData);
  }, []);

  useEffect(() => {
    console.log("in useEffect 2");
  }, []);

  useEffect(() => {
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

      clientSocket.on("newRecipient", (payload) => {
        console.log("new rec", payload.message);
        let index;

        if (usersData.uData.length !== 0 && lastMsg.msgs.length !== 0) {
          console.log("check:", usersData);
          count.current = 0;
          /* present.current =0
        notPresent.current =0 */
          usersData.uData.forEach((u, indx) => {
            console.log("in map");
            console.log("emails from map", payload.message.from, u.email);
            if (payload.message.from === u.email) {
              index = indx;
              console.log("index: ", index);
              count.current = count.current + 1;
              console.log("count: ", count.current);
            } else {
              //count.current.current = notPresent.current + 1 ;
              console.log("false", count.current);
            }
          });
          if (count.current !== 0) {
            console.log("in setRecArray", count.current);
            setRecArray(
              index,
              payload.message.messageBody,
              payload.message.type
            );
          } else if (count.current === 0) {
            setNewRecipient(
              payload.message.from,
              payload.message.messageBody,
              payload.message.type,
            );
            console.log("in setNewArray", count.current);
          } else console.log("nothing ", count.current);
        } else {
          console.log("no chat");
          console.log("usersData 1", lastMsg);
        }
      });
    }
  }, [usersData,lastMsg.msgs]);

  const setRecArray = (index, msg, type) => {
    //if(lastMsg)
    let items = [...lastMsg.msgs];
    console.log("items before change", items, lastMsg.msgs);
    items[index] = msg;
    console.log("items", items);
    setLastMsg((m) => {
      //if(lastMsg.msgs.length !== 0){

      //console.log("items",items)
      //console.log("users Msgs",m)
      return { ...m, msgs: items };
      //}
    });
  };

  const setNewRecipient = (rec, msg, type) => {
    console.log("in new chattt",type)
    userservice
      .getUserByEmail({ userEmail: rec })
      .then((data) => {
        console.log("data",data);
        setData((d) => {
          let obj = { email: rec, gender : data[0].gender, id : data[0]._id, 
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
        setLastMsg({msgs: [...lastMsg.msgs,msg], emails: [...lastMsg.emails,rec], 
                  types:[...lastMsg.types,type], senders:[...lastMsg.senders,rec]})
      }
      else{
        console.log("first recipient")
        setLastMsg({msgs: [msg], emails: [rec], types:[type], senders:[rec]})
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
    <div>
      <Header />
      <PageTitle name={"My Chats"} />

      {console.log("in return")}
      {usersData.uData.length !== 0  && lastMsg.msgs.length !==0? (
        <Paper md={8} xs={4} className={classes.mygrid}>
          <SingleChat recipients={usersData.uData} lastMsg={lastMsg} />
        </Paper>
      ) : (
        <h5 style={{ textAlign: "center" }}>No Chats Yet!</h5>
      )}
    </div>
  );
};
export default AllChats;
