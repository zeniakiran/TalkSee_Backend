import { Button, Typography,Paper, Grid, Hidden } from "@material-ui/core";
import { isAuthenticated } from "../clientStorages/auth";
import friendService from "../../../services/friendService";
import React, { useState, useContext} from "react";
import { useHistory } from 'react-router-dom';
import { SocketContext } from "../../../context/SocketContext";
import { lightBlue, grey} from '@material-ui/core/colors';

const SingleContact = (props) => {
    const { contact } = props;
    const roomId = '/'+contact._id
    let history = useHistory()
    var userData=JSON.parse(localStorage.getItem("user")) 
    const [showAddBtn, setAddBtn]=useState(userData.sentRequests.includes(contact._id)?false:true)
    const { clientSocket } = useContext(SocketContext);
    const myId=isAuthenticated()._id;
    const myName =isAuthenticated().firstName + " " +isAuthenticated().lastName;
    const myProfileImg =isAuthenticated().profileImg;
    const myEmail =isAuthenticated().email;
    const myGender =isAuthenticated().gender;
    const myLangPreference =isAuthenticated().langPreference;
    const sentFriendRequest=() => {
        friendService.sendRequest(
            {friendId:contact._id,
            myId,myName,myProfileImg,myEmail,myGender,myLangPreference})
         .then((data) => {
           localStorage.setItem("user",JSON.stringify(data));
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
             setAddBtn(true)
             
         })
         .catch((err) => {console.log(err);});

         clientSocket.emit(
            "rejectfriendRequest",
            { myName,roomId },
            (err) => {
              if (!err) console.log("emitted event");
              else console.log(err);
            }
          );
    }
    return (
        <div>
       <Paper style={{padding: '10px 20px', marginBottom:"1rem"}}
        >
            <Grid container>
                 <Grid item xs={3} md={1}>  <img src={contact.profileImg}  
                  onClick={ (e) => history.push('/user-profile/'+contact._id)}
          style={{ height: "60px", width: "60px", borderRadius: "20%" ,display:"inline", cursor:"pointer"}} alt="img"/> </Grid>
                <Grid item xs={9} md={9}> 
            
             <div style={{display:"inline"}}><p  className="user_names"   >{contact.firstName + " "+ contact.lastName}</p>
               <Typography style={{color:"gray", fontSize:"0.9rem" }}>{contact.email}</Typography>
               </div>
               </Grid>
               <Hidden only={['md', 'lg']}> 
                   <Grid item xs={3}></Grid></Hidden>
               <Grid item xs={9} md={2}>
                   
        {showAddBtn ?  
         <Button className= "loginbtn"
             style={{marginTop:"0.7rem",backgroundColor:lightBlue[600],color:"white"}}
            variant="contained" 
            onClick={sentFriendRequest}>Add friend</Button>
        : 
        <Button className= "loginbtn"
              style={{marginTop:"0.7rem",backgroundColor:grey[500],color:"white"}}
            variant="contained" 
            onClick={cancelFriendRequest}>Requested</Button> 
             }
              
             </Grid>
      </Grid>
     </Paper>       
   
    </div>
    );
}
 
export default SingleContact;