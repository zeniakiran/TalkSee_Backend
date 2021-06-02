import React, { useState, useEffect,useContext } from "react";
import AlertBar from "../Alerts/AlertBar";
import LinearBuffer from "../Alerts/ProgressBar";
import PageTitle from "./pageTitle";
import Select from "react-select";
import { makeStyles } from '@material-ui/core/styles';
import Resizer from 'react-image-file-resizer';
import { grey, cyan,lightBlue} from '@material-ui/core/colors';
import {Button} from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import Webcam from "react-webcam";
import { SocketContext } from "../../../context/SocketContext";
import { isAuthenticated } from "../clientStorages/auth";
import friendService from "../../../services/friendService";
const useStyles = makeStyles({
  
  textfield: {
    marginTop: "2rem",
  },
  Submitbtn: {
    marginTop: "0.6rem",
  },
});


const Profile = ( {match}) => {
     console.log(match.params.id)
     const contactId = match.params.id
     const roomId = '/'+contactId
    const myId=isAuthenticated()._id;
    const myName =isAuthenticated().firstName + " " +isAuthenticated().lastName;
    var userData=JSON.parse(localStorage.getItem("user")) 
    const [showAddBtn, setAddBtn]=useState(userData.sentRequests.includes(contactId)?false:true)
    const myProfileImg =isAuthenticated().profileImg;
    const myEmail =isAuthenticated().email;
    const myGender =isAuthenticated().gender;
    const myLangPreference =isAuthenticated().langPreference;
    const { clientSocket } = useContext(SocketContext);
    //console.log("Props ",props.match)
    const sentFriendRequest=() => {
        console.log("contact Id",contactId)
        friendService.sendRequest(
            {friendId:contactId,
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
            {friendId:contactId,myId})
         .then((data) => {
             localStorage.setItem("user",JSON.stringify(data));
            // dispatch({type:"FRIEND_REQUESTED",payload:{sentRequests:data.sentRequests }})
             setAddBtn(true)
             
         })
         .catch((err) => {console.log(err);});
    }
    
return (
    <div>
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
    
    </div>
    )
};

export default Profile;
