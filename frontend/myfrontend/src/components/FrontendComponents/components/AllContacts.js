import React, { useEffect } from "react";
import SingleContact from "./SingleContact";
import SingleFriend from "./SingleFriend";
import contactService from "../../../services/contactService";
import { Button, Grid } from "@material-ui/core";
import friendService from "../../../services/friendService";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { useHistory } from 'react-router-dom';


const AllContact = () => {

  const myId=isAuthenticated()._id;
  const [contacts, setContacts] = React.useState([]);
  const [friends, setFriends] = React.useState([]);
  let history = useHistory()

  const getFriendRequest = () => {
 friendService.getSentFriendRequest(myId)
 .then((data)=>{
    localStorage.setItem("user",JSON.stringify(data));})
 .catch((err=>{console.log(err)}))
 }
  const getAllMyFriends = () => {
 friendService.getAllFriends(myId)
 .then((data)=>{
   console.log(data)
  setFriends(data);})
 .catch((err=>{console.log(err)}))
 }
  
  const getAllContacts = () => {
  contactService.getAllContact()
  .then((data) => { setContacts(data);})
  .catch((err) => {console.log(err);});
};
 useEffect(()=> {
  
   getAllMyFriends();
   getFriendRequest();
   getAllContacts()
   

  }, []);
  
 
  return ( 
  <div>
    <PageTitle name= {"TalkSee User"}/>
     <Button className= "loginbtn"
           style={{marginLeft:"20rem"}}
          variant="contained" 
          onClick={event =>  history.push('/dashboard')}>Back</Button>
   {
    contacts.length === 0 ? 
      ( <div style= {{textAlign: "center",
  padding: "6rem", fontWeight:"bold"}}>No one using TalkSee</div>) 
      :(
          <Grid container  style={{marginTop:"3rem"}}>
        <Grid item xs ={1} md={3}> </Grid>
        <Grid item xs ={10} md={6}>
   
        { contacts.map((contact, index) => {
            return contact._id === myId ? (
            <div  >    </div>)
          :( 
          <div>
            {friends.length === 0 ?  <SingleContact key={index} contact={contact}    />
            :(<div>
             {friends.map((friend,index)=>{
              return friend.id === contact._id?(
                  <SingleFriend key={index} friend={friend}  onRemove={getAllMyFriends}   />
                ):
                <SingleContact key={index} contact={contact}    />
              
          }) }   
      </div>)
          }</div>)
           
          } )
        }
        </Grid>
        <Grid item xs={1}   md={3}></Grid>
      </Grid>
       
       
      )
        }
      
      
    )
       
    
    <Button className= "loginbtn"
           style={{marginLeft:"20rem",textTransform:"capitalize"}}
          variant="contained" 
          color="Primary"
          onClick={event =>  window.location.href='/all-friend-requests'}> All Friend requests</Button>
  </div> );
}

export default AllContact;