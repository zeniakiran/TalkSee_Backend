import React, { useState, useEffect } from "react";
import clsx from 'clsx';
import accountService from "../../../services/accountService";
import {
  Grid,
  Button,
  InputAdornment,
  InputLabel,
  FormControl,
  Input,
  Paper,
  IconButton,
  Typography,
} from "@material-ui/core";
import LockIcon from '@material-ui/icons/Lock';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
 import { grey, cyan,indigo} from '@material-ui/core/colors';
import isEmpty from "validator/lib/isEmpty";
import equals from "validator/lib/equals";
import LinearBuffer from "../Alerts/ProgressBar";
import AlertBar from "../Alerts/AlertBar";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import PageTitle from "./pageTitle";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

 const useStyles = makeStyles((theme) => ({
  textfield: {
     margin: theme.spacing(1),
  },
   margin:{
     marginTop: "1.2rem"
   } 
}));

const ResetPassword = ({ match }) => {
  const classes = useStyles();
  let history = useHistory();
  const [values, setValues] = useState({
    token: "",
    password: "",
    confirmPassword: "",
    errorMessage: "",
    successMsg: "",
    showPassword: false,
    showPassword1: false,
    loading: false,
  });
  
   const {
    token,
    password,
    confirmPassword,
    errorMessage,
    successMsg,
    loading,
  } = values;

    useEffect(() => {
        let token = match.params.token
        if(token) {
            setValues({...values, token})
        }
    }, [])
    const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
   const handleChange = (prop) => (event) => {
    setValues({
      ...values,
      [prop]: event.target.value,
      errorMessage: "",
      successMsg: "",
    });
  };
 const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPassword1: !values.showPassword1 });
  };
   const ResetPasswordBtn = (event) => {
    event.preventDefault();
    if (
      isEmpty(password) ||
      isEmpty(confirmPassword)
    ) {
      setValues({ ...values, errorMessage: "All fields are required" });
    } else if (!equals(password, confirmPassword)) {
      setValues({ ...values, errorMessage: "Passwords do not match" });
    } else {
  
     
      setValues({ ...values, loading: true });
     accountService.resetPassword( { newPassword: password, resetPasswordLink: token})
        .then((response) => {
          setValues({
            ...values,
            password: "",
            confirmPassword: "",
            errorMessage: false,
            successMsg: response.successMessage,
            loading: false,
          });
        })
        .catch((err) => {
          setValues({
            ...values,
             password: "",
            confirmPassword: "",
            loading: false,
            errorMessage: err.response.data.errorMessage,
          });
        });
    }
  };
     
  const ResetPasswordForm=()=>(
      
    <Grid container >
      <Grid item xs={1} sm={3} md={4}></Grid>
        <Grid item xs={10} sm ={6} md={4}>
          <Paper style={{padding: '30px 50px'}} >
          <Button  
            className= "loginbtn"
            href="https://mail.google.com/mail/u/0/#inbox"
            color="primary"
           style={{marginBottom:"2rem" ,paddingLeft:"0rem",color:indigo[800]  }}
          >
           <ArrowBackIcon style={{fontWeight:"bold",marginRight:"0.3rem"}}/> Go Back
          </Button>
             <FormControl className={clsx( classes.textField)} fullWidth>
         <InputLabel htmlFor="standard-adornment-password"> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic"  }}> New Password</Typography>
             <Typography variant="headline" style={{color:"red",marginLeft:"0.4rem" }}>*</Typography>
         </InputLabel>
                    <Input
            id="standard-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            name="password"
            value={values.password}
            onChange={handleChange('password')}
              
          startAdornment= {
            <InputAdornment position="start">
             <LockIcon style={{ color: grey[600] }}/>
            </InputAdornment>
          }
        
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
         
          <FormControl className={clsx(classes.margin, classes.textField)} fullWidth>
                 <InputLabel htmlFor="standard-adornment-password"> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic"  }}> Confirm Password</Typography>
             <Typography variant="headline" style={{color:"red",marginLeft:"0.4rem" }}>*</Typography>
         </InputLabel>
           <Input
            id="standard-adornment-confirmPassword"
            type={values.showPassword1 ? 'text' : 'password'}
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
             startAdornment= {
            <InputAdornment position="start">
             <VpnKeyIcon style={{ color: grey[600] }}/>
            </InputAdornment>
          }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword1 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
    
         <Button
             style={{ color: grey[50],
              backgroundColor:cyan[600],
              fontWeight:"bold", 
              borderRadius:"1rem" , 
              marginTop: "0.8rem",
              padding: "0.5rem",
              }}
            className= "loginbtn"
            variant="contained"
            fullWidth
            onClick={ResetPasswordBtn}
          >
            Reset Password 
          </Button>
          {successMsg &&  <Button
                     style={{  
                     backgroundColor:grey[500],
              fontWeight:"bold", 
              borderRadius:"1rem" , 
              marginTop: "0.8rem",
              padding: "0.5rem",
               }}
            className= "loginbtn"
            variant="outline"
            fullWidth
            onClick={event =>  history.push('/login')}
                  >
                      Login
                  </Button>}
           </Paper>
        </Grid>
     <Grid item xs={1} sm={3} md={4}></Grid>
    </Grid>
       
  );   
  return (
  <div>
        {loading && <LinearBuffer />}
      {errorMessage && (
        <AlertBar type="error" message={errorMessage} autoClose={4000} />
      )}
      {successMsg && (
        <AlertBar type="success" message={successMsg} autoClose={4000} />
      )}
       <PageTitle name= {"Reset Password"}/>
      {ResetPasswordForm()}
      
  </div>)
      }
export default ResetPassword;
