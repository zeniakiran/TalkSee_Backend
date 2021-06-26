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
             <Button className= "loginbtn"
             style={{ padding:"10px 40px", display:"block",backgroundColor:"#D03384",marginTop:"1.5rem"}}
            variant="contained" 
            color="Secondary"
            fullWidth
            onClick={event =>  history.push('/all-my-friends/'+myId)}>
              < PeopleAltIcon className='chaticon'
              color = "white"/> My Friends
            </Button>
             {
          frndcounter >= 1 ?
           <Button className= "loginbtn"
             style={{ padding:"10px 20px" ,display:"block",backgroundColor:"#D03384",marginTop:"1.5rem"}}
           variant="contained" 
            color="Secondary" 
             fullWidth
             onClick={event =>  history.push('/all-friend-requests/'+myId)}>
            <Badge badgeContent={frndcounter} color="secondary" style={{marginRight:"0.5rem"}}>
              <GroupAddRoundedIcon className='chaticon'
              onClick={event =>  history.push('/all-friend-requests/'+myId)}
              color = "white"
              />  
            </Badge>
            My Friend Requests
            </Button>
          :
         <Button className= "loginbtn"
             style={{ padding:"10px 50px" , display:"block",backgroundColor:"#D03384",marginTop:"1.5rem"}}
           variant="contained" 
            color="Secondary" 
            fullWidth
             onClick={event =>  history.push('/all-friend-requests/'+myId)}>
          <GroupAddRoundedIcon className='chaticon'
              color = "white"
              />  My Friend Requests
            </Button>
            
        }
        <Button className= "loginbtn"
             style={{padding:"10px 20px",display:"block",backgroundColor:"#D03384",marginTop:"1.5rem"}}
            variant="contained" 
            color="Secondary"
             fullWidth
            onClick={event =>  history.push('/all-contacts/'+myId)}>
              <PersonAddIcon className='chaticon'
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