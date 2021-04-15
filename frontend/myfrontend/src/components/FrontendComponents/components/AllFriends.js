import React, { useEffect } from "react";
import SingleFriend from "./SingleFriend";
import friendService from "../../../services/friendService";
import { Button, Grid } from "@material-ui/core";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
const AllFriends = () => {
     const myId=isAuthenticated()._id;
     const [friends, setFriends] =React.useState([]);
     const getAllMyFriends = () => 
     {
       friendService.getAllFriends(myId)
        .then((data)=>{
         setFriends(data);})
      .catch((err=>{console.log(err)}))
   
     }
    useEffect(getAllMyFriends , []);

     return ( 
    <div>
      <PageTitle name= {"My Friends"}/>
       <Button className= "loginbtn"
             style={{marginLeft:"20rem"}}
            variant="contained" 
            onClick={event =>  window.location.href='/dashboard'}>Back</Button>
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