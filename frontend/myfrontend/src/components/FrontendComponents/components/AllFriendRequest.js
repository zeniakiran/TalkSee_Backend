import React, { useEffect } from "react";
import SingleFriendRequest from "./SingleFriendRequest";
import friendService from "../../../services/friendService";
import { Button, Grid } from "@material-ui/core";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import { useHistory } from 'react-router-dom';
const AllFriendRequest = () => {
     const myId=isAuthenticated()._id;
     const [friendreqs, setFrndRequest] =React.useState([]);
     let history = useHistory()
     const getFriendRequest = () => 
     {
      friendService.getFriendRequest(myId).then((data)=>{
                setFrndRequest(data)})
            .catch((err=>{console.log(err)}))
     }
    useEffect(getFriendRequest , []);

     return ( 
    <div>
      <PageTitle name= {"Friend Requests"}/>
       <Button className= "loginbtn"
             style={{marginLeft:"20rem"}}
            variant="contained" 
            onClick={event =>  history.push('/all-contacts')}>Back</Button>
     {
      friendreqs.length === 0 ? 
        ( <div style= {{textAlign: "center",
    padding: "6rem", fontWeight:"bold"}}>No Friend Request</div>) 
        :
        (
        <Grid container   style={{marginTop:"3rem"}}>
          <Grid item xs ={1} md={3}> </Grid>
          <Grid item xs ={10} md={6}>
          {
          friendreqs.map((friendreq, index) => (
               <SingleFriendRequest key={index} friendreq={friendreq} onAcceptReject={getFriendRequest} /> )
          )}
          </Grid>
          <Grid item xs={1}   md={3}></Grid>
        </Grid>
         )
         
      }
      
 
    </div> );

}
export default AllFriendRequest;