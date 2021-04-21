import React, { useEffect } from "react";
import SingleContact from "./SingleContact";
import contactService from "../../../services/contactService";
import { Button, Grid } from "@material-ui/core";
import friendService from "../../../services/friendService";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { Link, useHistory } from 'react-router-dom';
import Header from "./Header";
const AllContact = () => {
    const myId=isAuthenticated()._id;
    let history = useHistory()
    const [contacts, setContacts] = React.useState([]);

    const getData = () => {
   friendService.getSentFriendRequest(myId)
   .then((data)=>{
      localStorage.setItem("user",JSON.stringify(data));})
   .catch((err=>{console.log(err)}))
   }
     
  const getSingleContact = () => {
    contactService.getSingleContact(myId)
    .then((data) => { setContacts(data);})
    .catch((err) => {console.log(err);});
  };

   useEffect(()=> {
     getData();
     getSingleContact();
 }, []);
    
   
    return ( 
    <div>
      <Header/>
      <PageTitle name= {"Add Friend"}/>
     
     {
      contacts.length === 0 ? 
        ( <div style= {{textAlign: "center",
    padding: "6rem", fontWeight:"bold"}}>All are your Friends <Link  to="/all-my-friends" >Click here</Link></div>) 
        :(
            <Grid container  style={{marginTop:"3rem", display:"flex"}}>
          <Grid item xs ={1} md={3}> </Grid>
          <Grid item xs ={10} md={6}>
     
           { contacts.map((contact, index) => {
              return contact._id === myId ? <div></div>
            : <SingleContact key={index} contact={contact}/>
            } )
          }
          <Button className= "loginbtn"
            style={{textTransform:"capitalize",float:"right"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/all-friend-requests')}> My Friend Requests</Button>
          </Grid>
          <Grid item xs={1}   md={3}></Grid>
        </Grid>
         
         
        )
          }
        
        
      )
         
      
      
    </div> );
}
 
export default AllContact;