import { Button,Grid,Paper } from "@material-ui/core";
import { isAuthenticated } from "../clientStorages/auth";
import friendService from "../../../services/friendService";
import { useHistory } from 'react-router-dom';
import React from "react";
import {   red  ,lightGreen} from '@material-ui/core/colors';
const SingleFriend = (props) => {
    const { friend ,onRemove, chatRec} = props;
    console.log(chatRec)
    const myId=isAuthenticated()._id;
    //const myEmail= isAuthenticated().email;
    const friendEmail =  friend.email;
     const RemoveFriend =()=>{
         friendService.deleteFriend({friendId: friend.id, myId}) 
          .then((data) => {
            //console.log(data)
           onRemove()
             localStorage.setItem("user",JSON.stringify(data));
             })
         .catch((err) => {console.log(err);});
      }
    const chatButtonHandler = (fr)=>{
      console.log("Fr",fr)
      console.log("pth","/chat/"+friendEmail+'/ '+fr.id)
      localStorage.setItem("friendId",fr.id)
      localStorage.setItem("recName",fr.name)
      localStorage.setItem("recLang",fr.langPreference)
      localStorage.setItem("profileUrl",fr.profileImg)
      history.push("/chat/"+friendEmail+' '+fr.id)
    } 
    let history = useHistory()
    return (
       <Paper style={{padding:  '12px 10px', marginBottom:"1rem" }}  >
         <Grid container style={{display:"flex"}}>
           <Grid item    xs ={12} sm={8} md={8}>
              <img src={friend.profileImg}
          style={{  marginRight:"0.3rem",height: "50px", width: "50px", borderRadius: "50%",display:"inline",padding:"0.2rem" }} alt="img"/>
              <p   style={{display:"inline" ,fontWeight:"bolder",fontSize:"1.2rem" }}>{friend.name}</p>
           </Grid>
           <Grid item   xs={12} sm={4} md={4}  >
             <Button className= "loginbtn"
              style={{ backgroundColor:lightGreen[700],color:"white",margin:"0.4rem" }}
            variant="contained" 
            size="medium"
            onClick={()=> chatButtonHandler(friend)} 
            >Chat</Button>
 
            <Button className= "loginbtn"
             style={{  backgroundColor:red[400],color:"white" }}
            variant="contained" 
             onClick ={RemoveFriend}
            >Remove</Button>
           </Grid>
         </Grid>
             
        
      
               </Paper> 
   
     );
}
 
export default SingleFriend;