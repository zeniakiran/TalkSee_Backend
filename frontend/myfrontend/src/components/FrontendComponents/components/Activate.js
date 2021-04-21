import React, { useState, useEffect } from 'react';
import accountService from "../../../services/accountService";
import jwt from 'jsonwebtoken';
import { grey,green, cyan,red} from '@material-ui/core/colors';
import {Button, Grid} from "@material-ui/core";
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import PageTitle from "./pageTitle";
import { useHistory } from 'react-router-dom';
const Activate = ({ match }) => {
 let token1 = match.params.token;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    token: '',
    errorMessage: "",
    successMsg: "",
  });
   const { firstName,lastName, token, errorMessage, successMsg} = formData;
   let history = useHistory()
  useEffect(() => {
    let token = match.params.token;
    let { firstName } = jwt.decode(token);
    let { lastName } = jwt.decode(token);
    if (token) {
      setFormData({ ...formData, firstName,lastName,  token });  
      accountService.accountActivation({token})
      .then(response => {
        setFormData({
          ...formData,
          errorMessage: false,
          successMsg: response.successMessage,
          firstName: response.firstName,
          lastName: response.lastName,
        });
      })
      .catch(err => {
      setFormData({
          ...formData,
          successMsg: false,
         errorMessage: err.response.data.errorMessage,
          firstName: err.response.data.firstName,
          lastName: err.response.data.lastName,
        });
      });
    }}, [match.params]);
     
  
  const ActivationSuccess=()=>(
<div> 
  <Grid container > 
 <Grid item xs={1} sm={3} md={4}></Grid>
  <Grid item xs={1} sm={3} md={4}> 
  
      <p><strong>Hi {firstName +" "+lastName}</strong></p>
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
              onClick={event =>  history.push('/profile-setup/'+token1)}
             
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
  
      <p><strong>Hi {firstName+" "+lastName}</strong></p>
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
            onClick={event =>  history.push('/signup')}
             
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
        <PageTitle name= {"Activation"}/>
       {errorMessage && ( ActivationFailure())}
       {successMsg && (ActivationSuccess())}
  </div>)
      }
export default Activate;