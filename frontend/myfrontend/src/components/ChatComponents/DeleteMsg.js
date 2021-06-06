import React from "react";
import "./chat.css"
import Checkbox from '@material-ui/core/Checkbox';
import "video-react/dist/video-react.css"
import { Button } from "@material-ui/core";
import chatservice from "../../services/ChatService";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';


const DeleteMsg = (props) => {
    const [open, setOpen] = React.useState(true);
    const [checked , setChecked] = React.useState(false)
    const handleClose = () => {
        props.setShow(false);
    };

    const checkedHandler = (e)=>{
        console.log(e.target.checked)
        setChecked(e.target.checked)
        
    }

    const deleteMsgHandler = (msgId) =>{
        console.log(msgId)
        
        chatservice.deleteMessage(msgId).then((res)=>{
          console.log("response: ",res)
          props.setShow(false)
          props.getData()
        })
        .catch((err)=>  console.log(err))
      
       }

       return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This message will be permanently deleted. Are you sure you want to continue?
          </DialogContentText>
          <div>
          <input type='checkbox' value = {checked} onClick={(e)=>checkedHandler(e)}/>
          <p style={{color: "gray", fontSize: '12px'}}>Do not ask again</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={()=>deleteMsgHandler(props.msgId)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
     );
}
 
export default DeleteMsg;