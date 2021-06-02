import { Button, Typography,Paper } from "@material-ui/core";
import { isAuthenticated } from "../clientStorages/auth";
import friendService from "../../../services/friendService";
import React, { useState, useContext} from "react";
import { useHistory } from 'react-router-dom';
import { SocketContext } from "../../../context/SocketContext";
import { lightBlue, grey} from '@material-ui/core/colors';
import { useHistory } from 'react-router-dom';
const SingleContact = (props) => {
     
    const { contact } = props;
    const roomId = '/'+contact._id
    let history = useHistory()
    var userData=JSON.parse(localStorage.getItem("user")) 
    const [showAddBtn, setAddBtn]=useState(userData.sentRequests.includes(contact._id)?false:true)
    const { clientSocket } = useContext(SocketContext);
    var userData=JSON.parse(localStorage.getItem("user")) 
    const [showAddBtn, setAddBtn]=useState(userData.sentRequests.includes(contact._id)?false:true)
    const { clientSocket } = useContext(SocketContext);
    let history = useHistory()
    //const [showAddBtn, setAddBtn]=useState(state?!state.sentRequests.includes(contact._id):true);
    const myId=isAuthenticated()._id;
    const myName =isAuthenticated().firstName + " " +isAuthenticated().lastName;
    const myProfileImg =isAuthenticated().profileImg;
    const myEmail =isAuthenticated().email;
    const myGender =isAuthenticated().gender;
    const myLangPreference =isAuthenticated().langPreference;
    const sentFriendRequest=() => {
        console.log("contact Id",contact._id)
        friendService.sendRequest(
            {friendId:contact._id,
            myId,myName,myProfileImg,myEmail,myGender,myLangPreference})
         .then((data) => {
           localStorage.setItem("user",JSON.stringify(data));
              // dispatch({type:"FRIEND_REQUESTED",payload:{sentRequests:data.sentRequests }})
             setAddBtn(false)
            
            })
         .catch((err) => {console.log(err);});

         clientSocket.emit(
            "friendRequest",
            { myName,roomId },
            (err) => {
              if (!err) console.log("emitted event");
              else console.log(err);
            }
          );
    }

     const cancelFriendRequest=()=>{
         
        friendService.cancelRequest(
            {friendId:contact._id,myId})
         .then((data) => {
             localStorage.setItem("user",JSON.stringify(data));
            // dispatch({type:"FRIEND_REQUESTED",payload:{sentRequests:data.sentRequests }})
             setAddBtn(true)
             
         })
         .catch((err) => {console.log(err);});
    }
 
    const contactClickHandler = ()=>{
        localStorage.setItem('contact',JSON.stringify(contact))
        //console.log("clicked",'/profile'+props.roomId+'/'+contact._id)
        history.push('/profile'+props.roomId+'/'+contact._id)
    }
    return (
        <div>
       <Paper style={{padding: '10px 20px', marginBottom:"2rem"}} onClick={contactClickHandler} >
              <img src={contact.profileImg}  className="img-fluid rounded-circle p-2"
          style={{ width: "4.9em" ,display:"inline" }} alt="img"/>
              <h4   style={{display:"inline"  }}>{contact.firstName + " "+ contact.lastName}</h4>
        {showAddBtn ?  
         <Button className= "loginbtn"
             style={{display:"inline-block"  ,position:"relative",float:"right",marginTop:"1rem", backgroundColor:lightBlue[600],color:"white"}}
            variant="contained" 
            onClick={sentFriendRequest}>Add friend</Button>
        : 
        <Button className= "loginbtn"
              style={{display:"inline-block" ,position:"relative",float:"right" ,marginTop:"1rem", backgroundColor:grey[500],color:"white"}}
            variant="contained" 
            onClick={cancelFriendRequest}>Requested</Button> 
             }
        <Typography style={{color:"gray",marginLeft:"5rem" ,  fontStyle: "italic" , fontSize:"0.9rem" }}>{contact.email}</Typography>
     </Paper>       
   
    </div>);
}
 
export default SingleContact;