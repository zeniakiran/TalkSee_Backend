import React from "react";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Header from "./Header";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WarningIcon from '@material-ui/icons/Warning';
import { isAuthenticated ,logout} from "../clientStorages/auth";
import { Button, Grid, Hidden } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import accountService from '../../../services/accountService'; 
import PageTitle from "./pageTitle";
import SideBar from "./SideBar";
const Settings = () => {
    let history = useHistory()
    const myId= isAuthenticated()._id;
    const [show,setShow] = React.useState(false);
    const DeleteAccount =()=>{
accountService.deleteMyAccount(myId)
 .then((res) =>{  logout(() => {
      history.push("/signup");
    }
    );})
  .catch((err) => console.log(err));
}
 const handleClose = () => {
        setShow(false);
    };
    return(
    <div div style={{height:"100vh"}} className="back_divs">
     <Grid container>
         <Hidden only={['xs', 'sm']}>
          <Grid item xs ={5} md={2}><SideBar/></Grid>
          </Hidden>
            <Hidden only={['md', 'lg']}>
          <Grid item xs={12} ><Header/></Grid>
          </Hidden>


       <Grid item xs={12} md={10}>
            <PageTitle name={"Account Settings "}/> 
            <Grid container style={{marginTop:"1.5rem"}}>
                <Grid item xs={1} md={3}></Grid>
                 <Grid item xs={10} md={6}>
             <Button className= "loginbtn editProfileBtn "
            variant="contained" 
            fullWidth
           onClick={event =>  history.push('/update-my-profile-setup/'+myId)}>
              < EditIcon className='accountSettingIcons' /> Edit Profile
            </Button>

        <Button className= "loginbtn deleteAccountBtn "
             onClick={(e)=>setShow(true)}
            variant="contained" 
             fullWidth>
              <DeleteIcon className='accountSettingIcons' /> Delete Account
            </Button>

            </Grid>
            </Grid>
             <Grid item xs={1} md={3}></Grid>
       </Grid>

       </Grid>


  {show?
   <Dialog open={show} onClose={handleClose} 
    aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"><WarningIcon  style={{color:"red",marginRight:"0.3rem",paddingBottom:'0.3rem'}}/><p style={{fontWeight:"bold",display:"inline" }}>Delete Account Warning</p></DialogTitle>
        <DialogContent>
          <DialogContentText>
           You will no longer be <strong>TalkSee</strong> member. Are you sure you want to continue?
          </DialogContentText>
          <hr/>
        </DialogContent>
        <DialogActions style={{padding:"0rem 1rem 1rem 1rem"}}>
          <Button onClick={handleClose}  
          style={{backgroundColor:"gray",color:"white"}}>
            Cancel
          </Button>
          <Button onClick={DeleteAccount} 
           style={{backgroundColor:"#0e7be9",color:"white"}}>
            Yes,Continue
          </Button>
        </DialogActions>
      </Dialog> 
    :null}
    </div>)
}
export default Settings;