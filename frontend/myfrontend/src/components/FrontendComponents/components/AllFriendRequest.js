import React, { useEffect, useContext, useRef,useState } from "react";
import SingleFriendRequest from "./SingleFriendRequest";
import friendService from "../../../services/friendService";
import { Button, Grid,InputAdornment, TextField  } from "@material-ui/core";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { useHistory } from 'react-router-dom';
import Header from "./Header";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { grey } from '@material-ui/core/colors';
import {SocketContext} from '../../../context/SocketContext';
import SearchIcon from '@material-ui/icons/Search';
import io from "socket.io-client";
 
const AllFriendRequest = ({match}) => {
     const myId=isAuthenticated()._id;
     const [friendreqs, setFrndRequest] =React.useState([]);
      const [searchTerm, setSearchTerm] = useState("");
    const onChangeSearch = (event) => 
        setSearchTerm(event.currentTarget.value)
     let clientSocket1 = useRef()
     let userEmail = isAuthenticated().email
     const {setSocket,roomJoin,messageEvent} = useContext(SocketContext);
     let roomId = useRef()
     roomId.current = '/'+match.params.id
     let history = useHistory()

     window.onload = () => {
       messageEvent()
      let did = JSON.parse(localStorage.getItem('user'))._id
      roomJoin(did)
      clientSocket1 = io("http://127.0.0.1:5000")
      setSocket((s)=>{
        s = clientSocket1
        s.on('connect' , () => {
          console.log("connected",s.id);
          s.emit("adduser",{id:s.id, name: userEmail.current})
          
        });
        return s;
      })
    };

     const getFriendRequest = () => 
     {
      friendService.getFriendRequest(myId).then((data)=>{
                setFrndRequest(data)})
            .catch((err=>{console.log(err)}))
     }
    useEffect(getFriendRequest , []);

    useEffect(()=>{
      //roomJoin(myId)
      
     },[])

   /*  useEffect(()=>{
      if(clientSocket){
        clientSocket.emit(
          "myChatsRoom",
          { myChatsRoom : roomId.current},
          ({error,room}) => {
            if (!error) {
              console.log("joined room with id", room);
            } else {
              console.log("error joining room", error);
            }
          }
        );
      }
     },[]) */

     return ( 
    <div>
      <Header/>
      <PageTitle name= {"Friend Requests"}/>
      <Grid container   style={{display:"flex" ,marginTop:"1.8rem",justifyContent:"center"}}>
          <Grid item xs ={1} md={5}> </Grid>
          <Grid item xs ={10} md={4}  >
            <TextField
                value={searchTerm}
                onChange={onChangeSearch}
                placeholder="Search By Name..."
                variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
             <SearchIcon style={{ color: grey[600] ,marginRight:"0.4rem",float:"right"}}/>
            </InputAdornment>
          ),
         }}
            />
            </Grid>
              <Grid item xs ={1} md={4}> </Grid>
            </Grid>
          
  
      {
      friendreqs.length === 0 ? 
        ( <div style= {{textAlign: "center",
    padding: "6rem", fontWeight:"bold"}}>No Friend Request</div>) 
        :
        (
        <Grid container   style={{marginTop:"3rem" }}>
          <Grid item xs ={1} md={3}> </Grid>
          <Grid item xs ={10} md={6}>
          {
          friendreqs.filter((friendreq)=>{
             if(searchTerm == "") return friendreq
             else if (friendreq.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                return friendreq
           }).map((friendreq, index) => (
               <SingleFriendRequest key={index} friendreq={friendreq} onAcceptReject={getFriendRequest}/> )
          )}
          </Grid>
          <Grid item xs={1}   md={3}></Grid>
        </Grid>
         )
         
      }
       <Grid container   style={{display:"flex" ,marginBottom:"2rem"}}>
          <Grid item xs ={1} md={3}> </Grid>
          <Grid item xs ={10} md={6}>
      
 <Button className= "loginbtn"
            style={{textTransform:"capitalize",float:"left"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/all-contacts/'+myId)}><ArrowBackIcon/> Back
            </Button>
         </Grid>
       <Grid item xs ={1} md={3}> </Grid>
       </Grid>
    </div> );

}
export default AllFriendRequest;