import React, { useEffect, useContext, useRef,useState } from "react";
import SingleContact from "./SingleContact";
import contactService from "../../../services/contactService";
import {  Grid,Hidden,InputAdornment, TextField  } from "@material-ui/core";
import friendService from "../../../services/friendService";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import {SocketContext} from '../../../context/SocketContext';
import io from "socket.io-client";
import Header from "./Header";
import SearchIcon from '@material-ui/icons/Search';
import SideBar from "./SideBar";

const AllContact = (props) => {
    const myId=isAuthenticated()._id;
    let userEmail = isAuthenticated().email;
    const[loading,setLoading]=useState(false);
     const [searchTerm, setSearchTerm] = useState("");
    const onChangeSearch = (event) => 
        setSearchTerm(event.currentTarget.value)
    const [contacts, setContacts] = React.useState([]);
    let roomId = useRef()
    let clientSocket1 = useRef()
    roomId.current = '/'+props.match.params.id;
  //  const IP_URL = localStorage.getItem('IP_URL')
    const {clientSocket,setSocket,roomJoin,messageEvent, friendReq} = useContext(SocketContext);
    window.onload = () => {
       friendReq()
      messageEvent()
      let did = JSON.parse(localStorage.getItem('user'))._id
      roomJoin(did)
      clientSocket1 = io(process.env.REACT_APP_IP_URL)
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
    .then((data) => { setContacts(data);
      setLoading(true)
    })
    .catch((err) => {console.log(err);});
  };

   useEffect(()=> {
     getData();
     getSingleContact();
 }, []);
 
  /*  useEffect(()=>{
    //roomJoin(myId)
    //messageEvent()
   },[]) */
    
   
    return ( 
      <div style={{height:"100vh"}} className="back_divs"  >
       <Grid container>
       <Hidden only={['xs', 'sm']}>
          <Grid item xs ={5} md={2}><SideBar/></Grid>
          </Hidden>
            <Hidden only={['md', 'lg']}>
          <Grid item xs={12} ><Header setLogin={props.setLogin}/></Grid>
          </Hidden>
           <Grid item xs={12} md={10}>
      <PageTitle name= {"Add Friend"}/>
      {loading?
      <div>{
      contacts.length === 0 ? 
        ( <div style= {{textAlign: "center", fontSize:"1.4rem",
    padding: "6rem", fontWeight:"bold"}}>No TalkSee User Found😞</div>) 
        :
        (<div >
          
            <Grid container  style={{marginTop:"0.9rem"}}>
          <Grid item xs ={1} md={1}> </Grid>
          <Grid item xs ={10} md={10} >
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
           
           </Grid>
          <Grid item xs={1}   md={1}></Grid>
        </Grid>
         
         
       </div> )
          }
          </div>:
          
       <div class="d-flex justify-content-center">
         <strong style={{marginRight:"1rem"}}>Loading...</strong>
  <div class="spinner-border" role="status">
    
  </div>
</div>
  }
        
        
      
        </Grid>
  
      </Grid>
             
    </div>
    );
}
 
export default AllContact;