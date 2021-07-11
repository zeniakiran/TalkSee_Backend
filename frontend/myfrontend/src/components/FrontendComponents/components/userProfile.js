import React, { useEffect, useContext, useRef,useState } from "react";
import accountService from "../../../services/accountService";
import {  Button, Grid,Hidden , Typography } from "@material-ui/core";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
import {SocketContext} from '../../../context/SocketContext';
import io from "socket.io-client";
import {indigo} from '@material-ui/core/colors';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Header from "./Header";
import SideBar from "./SideBar";

const UserProfile = (props) => {
    const id = props.match.params.id
    const [loading,setloading]=useState(false);
     const [profile, setProfile] = useState([])
     let clientSocket1 = useRef()
     let userEmail = isAuthenticated().email
     const {setSocket,roomJoin,messageEvent,friendReq,getRequest} = useContext(SocketContext);
     let roomId = useRef()
     roomId.current = '/'+props.match.params.id
     window.onload = () => {
        friendReq()
       messageEvent()
       getRequest()
      let did = JSON.parse(localStorage.getItem('user'))._id
      roomJoin(did)
      clientSocket1 = io(process.env.REACT_APP_IP_URL)
      setSocket((s)=>{
        s = clientSocket1
        s.on('connect' , () => {
          console.log("connected",s.id);
          s.emit("adduser",{id:s.id, name: userEmail.current})
          
        });
        return s;
      })
    };
   
     useEffect(() => {
     accountService.getMyAccount(id).then((response) => {
     setProfile(response);
     setloading(true)
    }).catch((err) => {console.log(err);})
  }, []);

    return(
     <div style={{height:"100vh"}} className="back_divs"  >
       <Grid container>
       <Hidden only={['xs', 'sm']}>
          <Grid item xs ={5} md={2}><SideBar/></Grid>
          </Hidden>
            <Hidden only={['md', 'lg']}>
          <Grid item xs={12} ><Header setLogin={props.setLogin}/></Grid>
          </Hidden>
           <Grid item xs={12} md={10}>
      <PageTitle name= {"User Profile"}/> 
       <Button  
            className= "loginbtn"
           onClick={(e)=>props.history.goBack()}
            color="primary"
           style={{marginLeft:"2rem" ,paddingLeft:"0rem",color:indigo[800]  }}
          >
            <ArrowBackIcon style={{fontWeight:"bold",marginRight:"0.3rem"}}/> Go Back
          </Button>
           {loading?
          <Grid container>
              <Grid item xs={1} md={2}></Grid>
              <Grid item xs={4} md={3}>
                  <img src={profile.profileImg}  
          style={{   borderRadius: "20%"}} alt="img"/>
       
              </Grid>
              <Grid item xs={7} md={7} style={{padding:"2rem"}}>
                  <div>
                  <Typography style={{display:"inline"}}> <strong>Name: </strong></Typography>
                  <Typography style={{display:"inline"}}>{profile.firstName + " " +profile.lastName}</Typography>
                  </div>
                   <div>
                  <Typography style={{display:"inline"}}> <strong>Email: </strong></Typography>
                  <Typography style={{display:"inline"}}>{profile.email}</Typography>
                  </div>
                    <div>
                  <Typography style={{display:"inline"}}> <strong>Language Preference: </strong></Typography>
                  <Typography style={{display:"inline"}}>{profile.langPreference}</Typography>
                  </div>
              </Grid>
          </Grid>:
           <div class="d-flex justify-content-center">
         <strong style={{marginRight:"1rem"}}>Loading...</strong>
         <div class="spinner-border" role="status"></div>
</div>}
         </Grid>
       </Grid>
    </div>
    );
}
 
export default UserProfile;