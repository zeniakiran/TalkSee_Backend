import { Button,Grid,Paper,  } from "@material-ui/core";
import { isAuthenticated } from "../clientStorages/auth";
import friendService from "../../../services/friendService";
import { lightBlue,grey} from '@material-ui/core/colors';
const SingleFriendRequest = (props) => {
  const { friendreq ,onAcceptReject} = props;
  const myId=isAuthenticated()._id;
  const myName =isAuthenticated().firstName + " " +isAuthenticated().lastName;
  const myProfileImg =isAuthenticated().profileImg;
  const myEmail = isAuthenticated().email;
  const myGender =isAuthenticated().gender;
  const myLangPreference =isAuthenticated().langPreference;
  const RejectFriendRequest =()=>{
     friendService.rejectRequest({friendId: friendreq.id, myId}) 
      .then((data) => {
       onAcceptReject()
         localStorage.setItem("user",JSON.stringify(data));
         })
     .catch((err) => {console.log(err);});
  } 

    const AcceptFriendRequest =()=>{
     friendService.acceptRequest({
     friendId: friendreq.id,
     friendName:friendreq.name,
     friendProfileImg:friendreq.profileImg, 
      chatId:friendreq.email +"/"+myEmail,
      friendEmail:friendreq.email,
      friendGender:friendreq.gender,
      friendLangPreference:friendreq.langPreference,
      myId,myName,myProfileImg,myEmail,myGender,myLangPreference }) 
      .then((data) => {
       onAcceptReject()
         localStorage.setItem("user",JSON.stringify(data));
         console.log(data);
         })
     .catch((err) => {console.log(err);});
  } 

  return (
      <div>
   <Paper style={{padding:'12px 10px', marginBottom:"1rem" }}  >
      <Grid container style={{display:"flex"}}>
           <Grid item    xs ={12} sm={8} md={8}>
             <img src={friendreq.profileImg} 
       style={{  marginRight:"0.3rem",height: "50px", width: "50px", borderRadius: "50%",display:"inline",padding:"0.2rem" }} alt="img"/>
       <p   style={{display:"inline" ,fontWeight:"bolder",fontSize:"1.2rem" }}>{friendreq.name}</p>
       
           </Grid>
           <Grid item   xs={12} sm={4} md={4}  >
             <Button className= "loginbtn"
          style={{ backgroundColor:lightBlue[700],color:"white",margin:"0.4rem" }}
        variant="contained" 
        size="medium" 
        onClick ={AcceptFriendRequest} 
        >Accept</Button>
        <Button className= "loginbtn"
         style={{  backgroundColor:grey[600],color:"white" }}
        variant="contained" 
        onClick ={RejectFriendRequest} 
        >Reject</Button>
           </Grid>
           </Grid>
           
      
       </Paper>
 </div>
  )
}
export default SingleFriendRequest;