import React, { useEffect,useRef,useContext } from "react";
import SingleFriend from "./SingleFriend";
import friendService from "../../../services/friendService";
import { Button, Grid } from "@material-ui/core";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { useHistory } from 'react-router-dom';
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
      <PageTitle name= {"My Friends"}/>
       <Button className= "loginbtn"
             style={{marginLeft:"20rem"}}
            variant="contained" 
            onClick={event =>  history.push('/dashboard')}>Back</Button>
     {
      friends.length === 0 ? 
        ( <div style= {{textAlign: "center",
    padding: "6rem", fontWeight:"bold"}}>No Friend Found</div>) 
        :
        (
        <Grid container   style={{marginTop:"3rem"}}>
          <Grid item xs ={1} md={3}> </Grid>
          <Grid item xs ={10} md={6}>
          {
          friends.map((friend, index) => (
               <SingleFriend key={index} friend={friend} onRemove={getAllMyFriends} /> )
          )}
          </Grid>
          <Grid item xs={1}   md={3}></Grid>
        </Grid>
         )
         
      }
      
 
    </div> );

}
export default AllFriends;