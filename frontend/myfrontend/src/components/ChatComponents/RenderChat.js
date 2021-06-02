import TypeMessage from "./TypeMessage";
import React, { useEffect, useState, useRef } from "react";
import "./chat.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Header from "../FrontendComponents/components/Header";
import Button from '@material-ui/core/Button';
import Alert from '../FrontendComponents/Alerts/AlertBar'
import chatservice from "../../services/ChatService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Grid ,InputAdornment, TextField} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { grey } from '@material-ui/core/colors';
import SearchIcon from '@material-ui/icons/Search';

export default function RenderChat(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isSearch, setSearch] = useState(false)
  const open = Boolean(anchorEl);
  const options = [
    'Search',
    'Delete'
  ];

  
  //console.log("props",props.msgsToDel)
  const deleteChat = ()=>{
    if(props.msgsToDel.msgs !== undefined){
    console.log("props",props.msgsToDel.msgs)
    props.msgsToDel.msgs.map((msg) => {
      //console.log(msg._id)
      chatservice.deleteMessage(msg._id).then((res)=>console.log("response: ",res))
      .catch((err)=>console.log(err))
    })
    props.getData()
  }
  else{
    toast.error("Please select a message to delete",{
          position: toast.POSITION.TOP_LEFT,
        })
    //console.log("props", props.msgsToDel)
  }
  }
  
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setAnchorEl(null);
  };

  const itemClickHandler= (option)=>{
    
    if(option === 'Delete')
      props.setDel(!props.isDel)
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
  if(!props.isDel && !isSearch){
    elem = (
      <div>
      <IconButton
    aria-label="more"
    aria-controls="long-menu"
    aria-haspopup="true"
    onClick={handleClick}
    >
    <MoreVertIcon />
    </IconButton>
    <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
        style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
        },
        }}
    >
        {options.map((option) => (
        <MenuItem key={option} selected={option === 'Search'} onClick={()=>itemClickHandler(option)}>
            {option}
        </MenuItem>
        ))}
    </Menu>
      </div>
    )
  }
  else if(props.isDel){
    elem = (
      <Button onClick={deleteChat}>
          Delete
      </Button>
    )
  }
  else if(isSearch){
    elem = (
      <TextField
       value={props.searchTerm}
       onChange={onChangeSearch}
        placeholder="Search By Name..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
             <SearchIcon style={{ color: grey[600] ,marginRight:"1rem",float:"right"}}/>
            </InputAdornment>
          ),
         }}
            />
    )
  }

  return (
    <React.Fragment>
      <Header />
      <div className='singleChatContainer'>
      {console.log("isFriend?",props.isFriend)}
        <div className='mesgs'>
          <div className='msg_history'>
            <div className='profilediv'>
              <img
                className='profile'
                src={props.recipientInfo.url}
                alt='dp'
              />
              <span className='recName'>{props.recipientInfo.name}</span>
              {
                  elem
              }
            </div>
            {props.element}
            {props.loading ? (
              <div className='load'>
                <CircularProgress color='secondary' />
              </div>
            ) : null}
            
          </div>
          {
            props.isFriend === true?
            <TypeMessage sendMessage={props.sendMessage} />
            :
            <Alert
            type='error' 
            message='This person is not your friend anymore. Add them again to start a chat.'
            autoClose={5000}
            />
          }
          
        </div>
      </div>
    </React.Fragment>
  );
}
