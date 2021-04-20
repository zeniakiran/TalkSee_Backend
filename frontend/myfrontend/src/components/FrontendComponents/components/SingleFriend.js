import { Button,Paper } from "@material-ui/core";
import { isAuthenticated } from "../clientStorages/auth";
import friendService from "../../../services/friendService";
import { useHistory } from 'react-router-dom';
import React from "react";
import {   red  ,lightGreen} from '@material-ui/core/colors';
const SingleFriend = (props) => {
    const { friend ,onRemove} = props;
    console.log(friend)
    const myId=isAuthenticated()._id;
    const myEmail= isAuthenticated().email;
    const friendEmail =  friend.email;
     const RemoveFriend =()=>{
         friendService.deleteFriend({friendId: friend.id, myId}) 
          .then((data) => {
            console.log(data)
           onRemove()
             localStorage.setItem("user",JSON.stringify(data));
             })
         .catch((err) => {console.log(err);});
      }
    const chatButtonHandler = (fr)=>{
      console.log("Fr",fr)
      localStorage.setItem("recName",fr.name)
      localStorage.setItem("recLang",fr.langPreference)
      localStorage.setItem("profileUrl",fr.profileImg)
      history.push("/chat/"+friendEmail)
    } 
    let history = useHistory()
    return (
        <div>
       <Paper style={{padding: '10px 24px'}} >
              <img src={friend.profileImg}  className="img-fluid rounded-circle p-2"
          style={{ width: "4.9em" ,display:"inline" }} alt="img"/>
              <h4   style={{display:"inline"  }}>{friend.name}</h4>
        
     <div style={{display:"inline-flex",justifyContent:"space-between", position:"relative", float:"right",width: "170px",height: "auto",marginTop:"0.8rem"}}>
           
            <Button className= "loginbtn"
              style={{ backgroundColor:lightGreen[700],color:"white"}}
            variant="contained" 
            size="medium"
            onClick={()=> chatButtonHandler(friend)} 
            >Chat</Button>

            <Button className= "loginbtn"
             style={{  backgroundColor:red[400],color:"white" }}
            variant="contained" 
             onClick ={RemoveFriend}
            >Remove</Button>
            
           
          </div>
               </Paper> 
    <hr/>
          
   
    </div>);
}
 
export default SingleFriend;