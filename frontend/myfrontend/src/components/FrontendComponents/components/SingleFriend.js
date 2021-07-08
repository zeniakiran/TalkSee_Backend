import { Button,Grid,Paper } from "@material-ui/core";
import { isAuthenticated } from "../clientStorages/auth";
import friendService from "../../../services/friendService";
import { useHistory } from 'react-router-dom';
import React from "react";
import {   red  ,lightGreen} from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WarningIcon from '@material-ui/icons/Warning';
const SingleFriend = (props) => {
    const { friend ,onRemove, chatRec} = props;
    const [show,setShow] = React.useState(false);
    const [friends,setFriends]=React.useState();
    const myId=isAuthenticated()._id;
    const friendEmail =  friend.email;
     const RemoveFriend =(friend)=>{
         friendService.deleteFriend({friendId: friend.id, myId}) 
          .then((data) => {
            setShow(false);
           onRemove()
             localStorage.setItem("user",JSON.stringify(data));
             })
         .catch((err) => {console.log(err);}); 
      }
       const handleClose = () => {
        setShow(false);
    };
    const chatButtonHandler = (fr)=>{
      console.log("Fr",fr)
      console.log("pth","/chat/"+friendEmail+'/ '+fr.id)
      localStorage.setItem("friendId",fr.id)
      localStorage.setItem("recName",fr.name)
      localStorage.setItem("recLang",fr.langPreference)
      localStorage.setItem("profileUrl",fr.profileImg)
      history.push("/chat/"+friendEmail+' '+fr.id)
    } 
    const handleClickOpen= (frnd)=>{
       setShow(true)
  setFriends(frnd);
  console.log(frnd);
   
    }
    let history = useHistory()
    return (
       <Paper style={{padding:  '20px 10px', marginBottom:"1rem" }}  >
         <Grid container style={{display:"flex"}}>
           <Grid item    xs ={12} sm={12} md={9}>
              <img src={friend.profileImg}
          style={{  marginRight:"0.5rem",height: "60px", width: "60px", borderRadius: "20%",display:"inline",padding:"0.2rem" }} alt="img"/>
              <p   className="user_names"  >{friend.name}</p>
           </Grid>
           <Grid item   xs={12} sm={12} md={3}  >
             <Button className= "loginbtn"
              style={{ backgroundColor:lightGreen[700],color:"white",margin:"0.4rem" }}
            variant="contained" 
            size="medium"
            onClick={()=> chatButtonHandler(friend)} 
            >Chat</Button>
 
            <Button className= "loginbtn"
              onClick={()=>handleClickOpen(friend)}
             style={{  backgroundColor:red[400],color:"white" }}
            variant="contained" 
            >Remove</Button>
            </Grid>
            {show?
   <Dialog open={show} onClose={handleClose} 
    aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"><WarningIcon  style={{color:"red",marginRight:"0.3rem",paddingBottom:'0.3rem'}}/><p style={{fontWeight:"bold",display:"inline" }}>Remove Friend Warning</p></DialogTitle>
        <DialogContent>
          <DialogContentText>
           <strong>{friend.name}</strong>  will no longer be your friend. Are you sure you want to continue?
          </DialogContentText>
          <hr/>
        </DialogContent>
        <DialogActions style={{padding:"0rem 1rem 1rem 1rem"}}>
          <Button onClick={handleClose}  
          style={{backgroundColor:"gray",color:"white"}}>
            Cancel
          </Button>
          <Button onClick={()=>RemoveFriend(friends)} 
           style={{backgroundColor:"#0e7be9",color:"white"}}>
            Yes,Continue
          </Button>
        </DialogActions>
      </Dialog> 
    :null}
         </Grid>
             
        
      
               </Paper> 
  
     );
}
 
export default SingleFriend;