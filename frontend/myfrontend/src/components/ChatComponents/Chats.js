import React,{useRef,useEffect,useState} from "react";
import './chat.css'
import chatservice from "../../services/ChatService";

export default function Chats(props) {
  let contacts = ["Fariha"]
  /* console.log("Chats,",props.lastmsgs)*/
  //console.log("Rec,",props.recipients) 
  let recipients = props.recipients
  const onClickHandler =(e)=>{
    props.setActiveChat(e);
  }
useEffect (()=>{
   
},[])


  return (
    <React.Fragment>
      <div  >
        <div >
        {/* {console.log("in return",lastmsgs)} */}
          {
                  recipients.map((r,index) => {
                    //{
                      //console.log(lastmsgs,index)
                      return (
                      
                      <div className="chat_list">
                      {/* {console.log("in return")} */}
                      <div className="chat_people">
                        <div className="chat_img">
                          <img
                            src="https://ptetutorials.com/images/user-profile.png"
                            alt="sunil"
                          />
                        </div>
                        <div
                          className="chat_ib"
                          onClick={() => onClickHandler(r)}
                        >
                          <p>
                            {r}
                          </p>
                          {
                           
                          }
                          
                          
                        </div>
                      </div>
                    </div>
                    );
                })
          
          }
        </div>
      </div>
      {/* </div> */}
    </React.Fragment>
  );
}
