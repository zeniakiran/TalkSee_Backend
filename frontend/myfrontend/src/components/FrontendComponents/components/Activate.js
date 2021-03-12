import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { grey,green, cyan,red, brown} from '@material-ui/core/colors';
import {Button, Grid, Typography} from "@material-ui/core";
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
const Activate = ({ match }) => {
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    errorMessage: "",
    successMsg: "",
  });
   
  const { username, token, errorMessage, successMsg} = formData;
  useEffect(() => {
    let token = match.params.token;
    let { username } = jwt.decode(token);
    if (token) {
      setFormData({ ...formData, username,  token });
    }
    axios
      .post("http://localhost:5000/api/users/activation", {token})
      .then(response => {
        setFormData({
          ...formData,
          errorMessage: false,
          successMsg: response.data.successMessage,
        });
       
      })
      .catch(err => {
        
      setFormData({
          ...formData,
         errorMessage: err.response.data.errorMessage,
        });
      });
  }, [match.params]);
 
   
  
  const Header = () => (
    <Grid container >
      <Grid item xs={1} sm={2} xm={5} md={4}></Grid>
      <Grid item xs={10} sm={8} xm={2} md={4}>
         <Typography variant="headline" style={{marginBottom:"2rem", 
         marginTop:"3rem",
         textAlign:"center",
         fontSize:"5rem",
         color:brown[300],
         fontFamily:"Brush Script MT, Brush Script Std, cursive"}}
          component="h1">TalkSee</Typography>
        <hr/>  
      </Grid>
      
    <Grid item  xs={1} sm={2} xm={5} md={4}></Grid>
 
    </Grid>
  );
  const ActivationSuccess=()=>(
<div> 
  <Grid container > 
 <Grid item xs={1} sm={3} md={4}></Grid>
  <Grid item xs={1} sm={3} md={4}> 
  
      <p><strong>Hi {username}</strong></p>
        <div>  <CheckCircleRoundedIcon 
              style = {{ color: green[600],paddingTop:"0.3rem" }}/>  
           <span style ={{fontSize:"1.3rem"}} > Your account has been successfully verified. Click below to create your profile</span></div>
      <Button
             style={{ 
               color: grey[50],
              backgroundColor:cyan[600],
              fontWeight:"bold", 
              borderRadius:"1rem" , 
              marginTop: "0.8rem",
              padding: "0.5rem" }}
              variant="contained"
              className= "loginbtn"
              onClick={event =>  window.location.href='/login'}
             
          >
            Create Profile
          </Button>
          </Grid>
          <Grid item xs={1} sm={3} md={4}></Grid>
          </Grid>
   </div>


  );
   const ActivationFailure=()=>(
<div> 
  <Grid container > 
 <Grid item xs={1} sm={3} md={4}></Grid>
  <Grid item xs={1} sm={3} md={4}> 
  
      <p><i>Hi {username}</i></p>
        <div>  <CancelRoundedIcon 
              style = {{ color: red[600]  }}/>  
           <span style ={{fontSize:"1.3rem"}} > <strong>{errorMessage}</strong> </span></div>
      <Button
             style={{ 
               color: grey[50],
              backgroundColor:cyan[600],
              fontWeight:"bold", 
              borderRadius:"1rem" , 
              marginTop: "0.8rem",
              padding: "0.5rem" }}
            variant="contained"
             className= "loginbtn"
            onClick={event =>  window.location.href='/signup'}
            
             
          >
               Try  Again   
          </Button>
          </Grid>
          <Grid item xs={1} sm={3} md={4}></Grid>
          </Grid>
   </div>


  );
  return (
  <div>
       {Header()}
       {errorMessage && ( ActivationFailure())}
       {successMsg && (ActivationSuccess())}
  </div>)
      }
export default Activate;