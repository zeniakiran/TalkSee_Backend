import { Button,Grid,Paper,  } from "@material-ui/core";
import { isAuthenticated } from "../clientStorages/auth";
import friendService from "../../../services/friendService";
import { lightBlue,grey} from '@material-ui/core/colors';
import { useHistory } from 'react-router-dom';
const SingleFriendRequest = (props) => {
  const { friendreq ,onAcceptReject} = props;
  const myId=isAuthenticated()._id;
  let history = useHistory()
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
   <Paper style={{padding:'20px 10px', marginBottom:"1rem" }}  >
      <Grid container style={{display:"flex"}}>
           <Grid item    xs ={12} sm={12} md={9}>
             <img src={friendreq.profileImg} 
              onClick={ (e) => history.push('/user-profile/'+friendreq.id)}
              style={{ marginRight:"0.5rem",height: "60px", width: "60px",borderRadius: "20%",display:"inline",padding:"0.2rem",cursor:"pointer" }} alt="img"/>
              <p  className="frnd_names" >{friendreq.name}</p>
           </Grid>
           <Grid item   xs={12} sm={12} md={3}  >
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