import React, { useEffect,useRef,useContext } from "react";
import SingleFriend from "./SingleFriend";
import friendService from "../../../services/friendService";
import { Button, Grid } from "@material-ui/core";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { useHistory } from 'react-router-dom';
import Header from "./Header";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {SocketContext} from '../../../context/SocketContext';

const AllFriends = (props) => {
     const myId=isAuthenticated()._id;
     const [friends, setFriends] =React.useState([]);
     let history = useHistory()
     const clientSocket = useContext(SocketContext);
     let userEmail = useRef()
     userEmail.current = JSON.parse(localStorage.getItem("user")).email
     const getAllMyFriends = () => 
     {
       friendService.getAllFriends(myId)
        .then((data)=>{
         setFriends(data);})
      .catch((err=>{console.log(err)}))
   
     }
    useEffect(()=>{

      getAllMyFriends()
    }, []);
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
    <div>
      <Header/>
      <PageTitle name= {"My Friends"}/>
     {
      friends.length === 0 ? 
        ( <div style= {{textAlign: "center",
    padding: "6rem", fontWeight:"bold"}}>No Friend Found</div>) 
        :
        (
        <Grid container   style={{marginTop:"3rem",display :"flex"}}>
          <Grid item xs ={1} md={3}> </Grid>
          <Grid item xs ={10} md={6}>
          {
          friends.map((friend, index) => (
               <SingleFriend key={index} friend={friend} onRemove={getAllMyFriends} /> )
          )}
          <Button
              color="primary"
              aria-label="add"
              variant="outlined"
              style={{textTransform:"capitalize",float:"right"}}
              onClick={event => history.push('/all-contacts')}
            >
          <PersonAddIcon style={{marginRight:"0.2rem",fontSize:"1.6rem"}} />Add New Friend
          </Button>
          </Grid>
          <Grid item xs={1}   md={3}></Grid>
        </Grid>
         )
         
      }
      
 
    </div> );

}
export default AllFriends;