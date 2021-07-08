import React, { useEffect,useRef,useContext,useState } from "react";
import SingleFriend from "./SingleFriend";
import friendService from "../../../services/friendService";
import { Button, Grid,Hidden,InputAdornment, TextField  } from "@material-ui/core";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { useHistory } from 'react-router-dom';
import Header from "./Header";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {SocketContext} from '../../../context/SocketContext';
import {MyChatsContext} from '../../../context/MyChatsContext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { grey } from '@material-ui/core/colors';
import io from "socket.io-client";
import SearchIcon from '@material-ui/icons/Search';
import SideBar from "./SideBar";

const AllFriends = (props) => {
     const myId=isAuthenticated()._id;
     const [loading,setLoading]=useState(false);
     const [friends, setFriends] =React.useState([]);
     let history = useHistory()
      const [searchTerm, setSearchTerm] = useState("");
    const onChangeSearch = (event) => 
        setSearchTerm(event.currentTarget.value)
     let clientSocket1 = useRef()
      const {setSocket,roomJoin, messageEvent, friendReq} =  useContext(SocketContext);
     let userEmail = useRef()
     userEmail.current = JSON.parse(localStorage.getItem("user")).email

     window.onload = () => {
         friendReq()
       messageEvent()
      let did = JSON.parse(localStorage.getItem('user'))._id
      roomJoin(did)
      clientSocket1 = io("/")
      setSocket((s)=>{
        s = clientSocket1
        s.on('connect' , () => {
          console.log("connected",s.id);
          s.emit("adduser",{id:s.id, name: userEmail.current})
          
        });
        return s;
      })
    };

     const getAllMyFriends = () => 
     {
       friendService.getAllFriends(myId)
        .then((data)=>{
         setFriends(data);
        setLoading(true);})
      .catch((err=>{console.log(err)}))
   
     }
    useEffect(()=>{

      getAllMyFriends()
      
    }, []);
    useEffect(()=>{
      //roomJoin(myId)
      
     },[])

     useEffect(()=>{
      //messageEvent()
      
     },[])

    useEffect(()=>{
      /* if(clientSocket!==null){
        console.log(props.clientSocket)
        clientSocket.emit("adduser",{id:props.clientSocket.id, name: userEmail.current})
      }
      else{
        console.log("no socket")
      }  */
    },[])

     return ( 
    <div style={{height:"100vh"}} className="back_divs">
      <Grid container>
       <Hidden only={['xs', 'sm']}>
          <Grid item xs ={5} md={2}><SideBar/></Grid>
          </Hidden>
            <Hidden only={['md', 'lg']}>
          <Grid item xs={12} ><Header/></Grid>
          </Hidden>
           <Grid item xs={12} md={10}>
      <PageTitle name= {"My Friends"}/>
    {loading?
      <div> {
      friends.length === 0 ? 
        ( <div style= {{textAlign: "center",fontSize:"1.4rem",
    padding: "6rem", fontWeight:"bold"}}>You have no TalkSee Friend😞</div>) 
        :
        (
          <div>
             
        <Grid container   style={{marginTop:"0.9rem", display :"flex"}}>
          <Grid item xs ={1} md={1}> </Grid>
          <Grid item xs ={10} md={10}>
            <Grid container   style={{marginBottom:"1rem"}}>
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
          friends.filter((friend)=>{
             if(searchTerm == "") return friend
             else if (friend.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                return friend
           }).map((friend, index) => (
               <SingleFriend key={index} friend={friend} onRemove={getAllMyFriends} /> )
          )}
            
          </Grid>
          <Grid item xs={1}   md={1}></Grid>
        </Grid>
         </div>)
         
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
export default AllFriends;