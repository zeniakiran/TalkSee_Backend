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
import chatservice from "../../services/ChatService";

export default function RenderChat(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const options = [
    'Search',
    'Delete'
  ];

  
  //console.log("props",props.msgsToDel)
  const deleteChat = ()=>{
    //console.log("props",props.msgsToDel.msgs)
    props.msgsToDel.msgs.map((msg) => {
      console.log(msg._id)
      chatservice.deleteMessage(msg._id).then((res)=>console.log("response: ",res))
      .catch((err)=>console.log(err))
    })
    props.getData()

  }
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setAnchorEl(null);
  };

  const itemClickHandler= (option)=>{
    console.log(option)
    props.setDel(!props.isDel)
  }
  
  return (
    <React.Fragment>
      <Header />
      <div className='singleChatContainer'>
      
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
                  !(props.isDel) ?
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
                  :
                  <Button onClick={deleteChat}>
                  Delete
                  </Button>
              }
            </div>
            {props.element}
            {props.loading ? (
              <div className='load'>
                <CircularProgress color='secondary' />
              </div>
            ) : null}
          </div>
          <TypeMessage sendMessage={props.sendMessage} />
        </div>
      </div>
    </React.Fragment>
  );
}
