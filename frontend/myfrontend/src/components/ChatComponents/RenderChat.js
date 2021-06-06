import TypeMessage from "./TypeMessage";
import React , {useEffect,useState}from "react";
import "./chat.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from '@material-ui/core/IconButton';
import Alert from '../FrontendComponents/Alerts/AlertBar'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import Header from "../FrontendComponents/components/Header";
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import chatservice from "../../services/ChatService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CancelIcon from '@material-ui/icons/Cancel';
import {Grid ,InputAdornment, TextField} from "@material-ui/core";
import { grey } from '@material-ui/core/colors';

 

export default function RenderChat(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isSearch, setSearch] = useState(false)
  const open = Boolean(anchorEl);
  const options = [
    'Search',
    'Delete'
  ];
  const [openMenu, setMenu] = useState(true)
  const [open1, setOpen] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    //props.setMyOpen(true)
    setOpen(true)
  };

  const handleClose = (option) => {
    setAnchorEl(null);
  };

  const itemClickHandler= (option)=>{
   if(option === 'Delete'){
      props.setDel(true)
      setMenu(false)
   }
    else if(option === 'Search')
      setSearch(!isSearch)
  }


   const onChangeSearch = (event)=>{
    //props.setTerm(event.currentTarget.value)
    props.searchHandler(event.currentTarget.value)
  }
  useEffect(()=>{
    let imgUrl = props.recipientInfo.url;

  })
  let elem = null;
  if(openMenu){
    elem = (
      <div  style={{display:"inline",float:"right",marginTop:"0.6rem"}}>
      <IconButton
    className ="Allbtn" 
    aria-label="more"
    aria-controls="long-menu"
    aria-haspopup="true"
    onClick={handleClick}
    >
    <MoreVertIcon />
    </IconButton>
    {open1 ?
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
        style: {
            marginTop: '40px',
            maxHeight: 48 * 4.5,
            width: '20ch',
        },
      }}
      >
        <MenuItem onClick={()=>itemClickHandler('Search')}>
          <ListItemIcon>
            <SearchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </MenuItem>
        <MenuItem onClick={()=>itemClickHandler('Delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
    </Menu>
    :
    null
    }
      
    
      </div>
    )
  }
  if(props.isDel){
    elem = (
     <Button className="Allbtn" style={{textTransform:"capitalize" ,float:"right",marginTop:"0.8rem"}}>
          <CancelIcon style={{color:"gray"}} onClick={() => {
            console.log(props.isDel)
            props.setDel(false)
            setOpen(false)
            setMenu(true)
            }} />
      </Button>
    )
  }
  if(isSearch){
    elem = (
      <TextField
       style={{float:"right",marginRight:"1rem",marginTop:"0.8rem",backgroundColor:"white",borderRadius:"1rem"}}
       value={props.searchTerm}
       onChange={onChangeSearch}
        placeholder="Search Message"
        size="medium"
          
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <SearchIcon style={{ color: grey[600] ,marginRight:"0.4rem",float:"right"}}/>
              <Button className="Allbtn" style={{textTransform:"capitalize" ,float:"right",marginTop:"0.8rem"}}>
          <CancelIcon style={{color:"gray"}} onClick={() => {
            console.log(props.isDel)
            setSearch(false)
            setOpen(false)
            setMenu(true)
            }} />
      </Button>
            </InputAdornment>
          ),
          disableUnderline: true 
         }}
         
      />
      
    )
  }
  return (
    <React.Fragment>
       <div  style={{ height:"100vh"}} className="chat_div"> 
      <Header />     
            <Grid container spacing={0} style={{display:"flex"}}>
              <Grid item xs ={1} md={2}></Grid>
              <Grid item xs ={10} md={8} style={{marginTop:"1rem" }}>
                <div className='profilediv'>

              <img
                className='profile'
                src={props.recipientInfo.url}
                alt='dp'
              />
 
              <span   style={{display:"inline",fontWeight:"bold", fontSize: "21px" }}>{props.recipientInfo.name}</span>
              
              {      
                 elem
              }
            </div>
            <div className="content_body ">
              
             {props.element}
             {props.loading ? (
              <div className='load'>
                <CircularProgress color='secondary' />
              </div>
            ) : null}
 
            </div>
           { props.isFriend === true?
            <TypeMessage sendMessage={props.sendMessage} />
            :
            <Alert
            type='error' 
            message='This person is not your friend anymore. Add them again to start a chat.'
            autoClose={5000}
            />
          }
              </Grid>
              <Grid item xs ={1} md={2}></Grid>
              </Grid>
              </div>
              </React.Fragment>
 
  );
}
