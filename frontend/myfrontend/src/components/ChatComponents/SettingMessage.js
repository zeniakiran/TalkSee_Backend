import React, { useEffect } from "react";
import "./chat.css";
import { Player } from "video-react";
import Checkbox from "@material-ui/core/Checkbox";
import "video-react/dist/video-react.css";

export default function SettingMessage(props) {
  const [checked, setChecked] = React.useState(false);
  const [messages, setMessages] = React.useState();
  let someArray = [];
  const handleChange = (event, message) => {
    setChecked((c) => {
      c = event.target.checked;
      if (c === true) {
        setMessages((m) => {
          if (m !== undefined) {
            if (m.msgs !== undefined) {
              let msgs = [...m.msgs];
              msgs = [...msgs, message];
              return { ...m, msgs };
            } else {
              return { msgs: [message] };
            }
          } else {
            return { msgs: [message] };
          }
        });
      } else {
        if (messages.msgs !== undefined) {
          someArray = messages.msgs;
          someArray = messages.msgs.filter((m) => {
            return m._id !== message._id;
          });
          setMessages(someArray);
        } else {
          setMessages((m) => {
            return (m = []);
          });
        }
      }
      return c;
    });
  };

  let elem = null;
  let indexOfTerm = []
  let msgArr = []
  if(props.term){
    console.log("term",props.term)
    
    indexOfTerm.push(props.message.messageBody.indexOf(props.term))
    msgArr.push(props.message.messageBody.split(""))
    console.log("term exists",indexOfTerm)

  }
  else{
    console.log("no term")
  }
  if(msgArr.length>=1){
    for (var i=0; i<msgArr.length; i++){
      if(props.term === msgArr[i])
      console.log("m",msgArr[i])
      else
      console.log("no mm",msgArr[i])
    }
  }

  if (props.message.to === props.user) {
    //console.log("Type received")
    elem = (
      <div className='msgdiv'>
        <div className='incoming_msg_img'>
          {props.isDel ? (
            <Checkbox
              onChange={(e) => {
                handleChange(e, props.message);
              }}
              inputProps={{ "aria-label": "primary checkbox" }}
              name='gilad'
            />
          ) : null}
        </div>
        <div className='received_msg'>
          <div className='received_withd_msg'>
            <span className='playerdiv1'>
              <Player>
                <source src={props.message.messageVideo} />
              </Player>
            </span>
            {
               props.term && msgArr?
                  msgArr.map((m)=>console.log("m",m))
              : 
                  <p>{props.message.messageBody}</p>
                  
            }
            
            <span className='time_date'> {props.message.time}</span>
          </div>
        </div>
      </div>
    );
  } else if (props.message.from === props.user) {
    elem = (
      <div class='outgoing_msg'>
        {props.isDel ? (
          <Checkbox
            onChange={(e) => {
              handleChange(e, props.message);
            }}
            inputProps={{ "aria-label": "primary checkbox" }}
            name='gilad'
          />
        ) : null}
        <div class='sent_msg'>
          <span className='playerdiv2'>
            {
              <Player>
                <source src={props.message.messageVideo} />
              </Player>
            }
          </span>

          {
            props.term?
            <p>{props.message.messageBody}</p>
              : 
                  <p>{props.message.messageBody}</p>
                  
            }
            {console.log("mArr",msgArr)}
          <span class='time_date'> {props.message.time}</span>
        </div>
      </div>
    );
  } else {
    console.log("nothing");
  }

  useEffect(() => {
    props.delHandler(messages);
  }, [messages]);

  return (
    elem
  );
}
