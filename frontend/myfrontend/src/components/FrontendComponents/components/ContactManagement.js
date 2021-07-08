import React, { useEffect, useState,useContext  } from "react";
import {SocketContext} from '../../../context/SocketContext';
import Header from "./Header";
import { isAuthenticated } from "../clientStorages/auth";
import GroupAddRoundedIcon from '@material-ui/icons/GroupAddRounded';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import Badge from '@material-ui/core/Badge';
import { Button, Grid, Hidden } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import PageTitle from "./pageTitle";
import SideBar from "./SideBar";
const ContactManagement = () => {
    let history = useHistory()
    const {frndcounter}  = useContext(SocketContext);
    const myId= isAuthenticated()._id;
    return(<div div style={{height:"100vh"}} className="back_divs">
       
    
     <Grid container>
         <Hidden only={['xs', 'sm']}>
          <Grid item xs ={5} md={2}><SideBar/></Grid>
          </Hidden>
            <Hidden only={['md', 'lg']}>
          <Grid item xs={12} ><Header/></Grid>
          </Hidden>
          
       
       <Grid item xs={12} md={10}>
            <PageTitle name={"My Contacts"}/> 
            <Grid container style={{marginTop:"1.5rem"}}>
                <Grid item xs={1} md={3}></Grid>
                 <Grid item xs={10} md={6}>
             <Button className= "loginbtn myFriendsBtn"
               variant="contained" 
            fullWidth
            onClick={event =>  history.push('/all-my-friends/'+myId)}>
              < PeopleAltIcon className='contactManagementIcon'
              color = "white"/> My Friends
            </Button>
             {
          frndcounter >= 1?
           <Button className= "loginbtn friendRequestBtn"
               variant="contained" 
             fullWidth
             onClick={event =>  history.push('/all-friend-requests/'+myId)}>
               <GroupAddRoundedIcon className='contactManagementIcon'
              onClick={event =>  history.push('/all-friend-requests/'+myId)}
              />  
              <Badge badgeContent= {frndcounter} color="secondary" style={{margin:" -28px 0.8rem 0 -3px"}}></Badge>
            My Friend Requests
            </Button>
          :
         <Button className= "loginbtn friendRequestBtn"
              variant="contained" 
            color="Secondary" 
            fullWidth
             onClick={event =>  history.push('/all-friend-requests/'+myId)}>
              <GroupAddRoundedIcon className='contactManagementIcon'
              onClick={event =>  history.push('/all-friend-requests/'+myId)}
              />  
              
             My Friend Requests
            </Button>
            
        }
        <Button className= "loginbtn addFriendBtn"
               variant="contained" 
            color="Secondary"
             fullWidth
            onClick={event =>  history.push('/all-contacts/'+myId)}>
              <PersonAddIcon className='contactManagementIcon'
              color = "white"/> Add New friend
            </Button>
            </Grid>
            </Grid>
             <Grid item xs={1} md={3}></Grid>
       </Grid>
       
       </Grid>
    </div>)
}
export default ContactManagement;