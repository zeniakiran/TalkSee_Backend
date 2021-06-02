import React, { useEffect, useContext, useRef,useState } from "react";
import SingleContact from "./SingleContact";
import contactService from "../../../services/contactService";
import { Button, Grid ,InputAdornment, TextField} from "@material-ui/core";
import friendService from "../../../services/friendService";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {SocketContext} from '../../../context/SocketContext';
import io from "socket.io-client";
import Header from "./Header";
import { grey } from '@material-ui/core/colors';
import SearchIcon from '@material-ui/icons/Search';

const AllContact = ({match}) => {
    const myId=isAuthenticated()._id;
    let userEmail = isAuthenticated().email;
    let history = useHistory()
     const [searchTerm, setSearchTerm] = useState("");
    const onChangeSearch = (event) => 
        setSearchTerm(event.currentTarget.value)
    const [contacts, setContacts] = React.useState([]);
    let roomId = useRef()
    let clientSocket1 = useRef()
    roomId.current = '/'+match.params.id
    const {setSocket,roomJoin,messageEvent, friendReq} = useContext(SocketContext);
    window.onload = () => {
       friendReq()
      messageEvent()
      let did = JSON.parse(localStorage.getItem('user'))._id
      roomJoin(did)
      clientSocket1 = io("http://127.0.0.1:5000")
      setSocket((s)=>{
        s = clientSocket1
        s.on('connect' , () => {
          console.log("connected",s.id);
          s.emit("adduser",{id:s.id, name: userEmail})
          
        });
        return s;
      })
    };

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
 
   useEffect(()=>{
    //roomJoin(myId)
    //messageEvent()
   },[])
    
   
    return ( 
    <div style={{height:"100vh"}} className="back_divs"  >
      <Header/>
      <PageTitle name= {"Add Friend"}/>
      {
      contacts.length === 0 ? 
        ( <div style= {{textAlign: "center", height:"100vh",
    padding: "6rem", fontWeight:"bold"}}>No User Found</div>) 
        :
        (<div >
          
            <Grid container  style={{marginTop:"0.9rem"}}>
          <Grid item xs ={1} md={2}> </Grid>
          <Grid item xs ={10} md={8} >
            <Grid container   style={{marginBottom:"1rem" }}>
          <Grid item xs ={0} md={8}> </Grid>
          <Grid item xs ={12} md={4}  >
            <TextField
                value={searchTerm}
                onChange={onChangeSearch}
                placeholder="Search by typing name"
                 
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
             <SearchIcon style={{ color: "black" ,marginRight:"0.4rem",float:"right"}}/>
            </InputAdornment>
          ),
         }}
            />
            </Grid>
            </Grid>
     
           { contacts.filter((contact)=>{
             if(searchTerm === "") return contact
             else if (contact.firstName.toLowerCase().startsWith(searchTerm.toLowerCase()) || contact.lastName.toLowerCase().startsWith(searchTerm.toLowerCase()) )
                return contact
           }).map((contact, index) => {
              return contact._id === myId ? 
              <div></div>
            : <SingleContact key={index} contact={contact}  roomId={roomId.current}/>
                 
            } )
          }
           <Button className= "loginbtn"
            style={{textTransform:"capitalize",float:"right"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/all-friend-requests/'+myId)}> My Friend Requests</Button>
        
        <Button className= "loginbtn"
            style={{textTransform:"capitalize",float:"left"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/dashboard/'+myId)}><ArrowBackIcon/> Back
            </Button>
           </Grid>
          <Grid item xs={1}   md={2}></Grid>
        </Grid>
         
         
       </div> )
          }
        
        
      )
             
    </div> );
}
 
export default AllContact;