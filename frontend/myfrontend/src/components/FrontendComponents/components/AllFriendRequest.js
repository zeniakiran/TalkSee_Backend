import React, { useEffect, useContext, useRef,useState } from "react";
import SingleFriendRequest from "./SingleFriendRequest";
import friendService from "../../../services/friendService";
import { Button, Grid,Hidden,InputAdornment, TextField  } from "@material-ui/core";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { useHistory } from 'react-router-dom';
import Header from "./Header";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { grey } from '@material-ui/core/colors';
import {SocketContext} from '../../../context/SocketContext';
import SearchIcon from '@material-ui/icons/Search';
import io from "socket.io-client";
import SideBar from "./SideBar";
 
const AllFriendRequest = ({match}) => {
     const myId=isAuthenticated()._id;
     const[loading,setLoading]=useState(false);
     const [friendreqs, setFrndRequest] =React.useState([]);
      const [searchTerm, setSearchTerm] = useState("");
    const onChangeSearch = (event) => 
        setSearchTerm(event.currentTarget.value)
     let clientSocket1 = useRef()
     let userEmail = isAuthenticated().email
     const {setSocket,roomJoin,messageEvent,friendReq,getRequest,acceptRejectCounter} = useContext(SocketContext);
     let roomId = useRef()
     roomId.current = '/'+match.params.id
     let history = useHistory()

     window.onload = () => {
        friendReq()
       messageEvent()
       getRequest()
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
                setFrndRequest(data)
                setLoading(true);
                acceptRejectCounter();
              })
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
    <div  style={{height:"100vh"}} className="back_divs">
     <Grid container>
       <Hidden only={['xs', 'sm']}>
          <Grid item xs ={5} md={2}><SideBar/></Grid>
          </Hidden>
            <Hidden only={['md', 'lg']}>
          <Grid item xs={12} ><Header/></Grid>
          </Hidden>
           <Grid item xs={12} md={10}>
      <PageTitle name= {"Friend Requests"}/>
      {loading?
      <div> {
      friendreqs.length === 0 ? 
        ( <div style= {{textAlign: "center",fontSize:"1.4rem",
    padding: "6rem", fontWeight:"bold"}}>You have no friend request😞</div>) 
        :
        (
          <div>
        <Grid container   style={{marginTop:"0.9rem" }}>
          <Grid item xs ={1} md={1}> </Grid>
          <Grid item xs ={10} md={10}>
            <Grid container   style={{marginBottom:"1rem" }}>
          <Grid item xs ={0} md={7}> </Grid>
          <Grid item xs ={12} md={5}  >
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
          {
          friendreqs.filter((friendreq)=>{
             if(searchTerm == "") return friendreq
             else if (friendreq.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                return friendreq
           }).map((friendreq, index) => (
               <SingleFriendRequest key={index} friendreq={friendreq} onAcceptReject={getFriendRequest}/> )
          )}
           
          </Grid>
          <Grid item xs={1}   md={10}></Grid>
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
    </div> );

}
export default AllFriendRequest;