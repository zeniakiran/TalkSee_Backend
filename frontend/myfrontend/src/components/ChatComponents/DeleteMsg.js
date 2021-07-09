import React,{useContext,useState} from "react";
import "./chat.css"
import "video-react/dist/video-react.css"
import { Button } from "@material-ui/core";
import chatservice from "../../services/ChatService";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WarningIcon from '@material-ui/icons/Warning';
import { DeletePermission } from "../../context/DeletePermissionContext";


const DeleteMsg = (props) => {
 
   var boxchecked = JSON.parse(localStorage.getItem("deletion"));
     const { dispatch } = useContext(DeletePermission);
    const [checked , setChecked] = useState(boxchecked.state)
    const handleClose = () => {
        props.setShow(false);
    };

    const checkedHandler = (e)=>{
        console.log(e.target.checked)
        setChecked(e.target.checked)
      dispatch({ type: "updatePermission", value: e.target.checked })
    }

    const deleteMsgHandler = (msgId) =>{
        console.log("mid in deleteMsg",msgId)
        chatservice.deleteMessage(msgId).then((res)=>{
          console.log("response: ",res)
          props.setShow(false)
          props.getData()
        })
        .catch((err)=>  console.log(err))
      
       }

       return (
         
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"><WarningIcon  style={{color:"red",marginRight:"0.3rem",paddingBottom:'0.3rem'}}/><p style={{fontWeight:"bold",display:"inline" }}>Delete Warning</p></DialogTitle>
        <DialogContent>
          <DialogContentText>
            This message will be permanently deleted. Are you sure you want to continue?
          </DialogContentText>
          <div>
          <input type='checkbox' value = {checked}  defaultChecked={checked} onClick={(e)=>checkedHandler(e)}/>
          <p style={{color: "black", fontSize: '16px',display:"inline",marginLeft:"0.7rem"}}>Do not ask me again?</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}  style={{backgroundColor:"gray",color:"white"}}>
            No
          </Button>
          <Button onClick={()=>deleteMsgHandler(props.msgId)}  style={{backgroundColor:"#0e7be9",color:"white"}}>
            Yes
          </Button>
        </DialogActions>
      </Dialog> 
     );
}
 
export default DeleteMsg;