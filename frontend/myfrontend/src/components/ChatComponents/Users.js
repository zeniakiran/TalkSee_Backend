import React, { useState, useEffect ,useRef} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
//import ListItemAvatar from "@material-ui/core/ListItemAvatar";
//import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
//import socketIOClient from "socket.io-client";
import { useHistory } from 'react-router-dom';
import userservice from "../../services/UserService";
import groupservice from "../../services/GroupService";
import { isAuthenticated, logout } from "../FrontendComponents/clientStorages/auth";
import { v4 as uuidv4 } from 'uuid';
import "./users.css"
//import commonUtilites from "../Utilities/common";

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
  },
  list: {
    maxHeight: "calc(100vh - 112px)",
    overflowY: "auto",
    
  },
  avatar: {
    margin: theme.spacing(0, 3, 0, 1),
  },
  listText:{
    fontSize : '1.3rem',
    fontFamily : 'Roboto'
  }
  ,listText1:{
    fontSize : '1rem',
    fontFamily : 'Roboto',
    color : 'gray'
  }
  , listBtn:{
    backgroundColor: 'rgb(0, 172, 193)',
    color : 'white',
    fontSize : '1rem'
  }
}));

const Users = (props) => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState(null);
  const [show, setShow] = React.useState(false)
  let count = useRef(0);
  let userId = useRef("");
  let name = useRef("")
  let userslist = useRef([])
  let history = useHistory();
  let recipients = []
  //const getUsers = useGetUsers();
  const getData = () => {
    userId.current= localStorage.getItem("userId")
    console.log(userId.current)
    userservice.getUsers()
   .then((data) => {
        userslist.current = data
        userslist.current = userslist.current.filter((u)=>{
          return u.email !== userId.current
        })
        setUsers(userslist.current ); 
        console.log("contacts",users)
  })
   .catch((err) => console.log("This is err"+ err));
}
  useEffect(()=>{
    getData()
    console.log(props)
    props.clientSocket.current.emit("adduser",{id:props.clientSocket.current.id, name: userId.current})
  },[]);

    const userClickHandler = (u) =>{
        let email = u.email
        let fname= u.firstName
        let lname = u.lastName
        let lang = u.langPreference
        let profileUrl = u.profileImg
        let x = fname+' '+lname
        localStorage.setItem("recName",x)
        localStorage.setItem("recLang",lang)
        localStorage.setItem("profileUrl",profileUrl)
        history.push('/chat/'+email); 
        
  }

  const viewButtonHandler = ()=>{
    history.push('/mychats/'); 
  }
    const showButtons = ()=>{
      setShow(true)
    }

    const addGroupMember = (e)=>{
          console.log("target",e)
          count.current = count.current+1
          console.log("count",count)
        recipients.push(e)
        console.log("Rec",recipients)
    }

    const createGroup = () =>{
      if(recipients.length > 1){
        let groupMembers = recipients
        let groupName = name.current
        let groupId = uuidv4();
        let createdBy = userId.current
        groupservice.createGroup({groupName,groupId,createdBy,groupMembers})
              .then((data)=>{
                  console.log("Created successfully",data);
                  history.push('/groupchat'+'/'+groupId)
                  //getData();
                })
              .catch((err)=>{console.log("Some Err")})
        //history.push('/chat/'+address);
        //history.push('/groupchat'+'/'+name.current+'/'+address)
      }
    }

    const nameHandler = (e) =>{
      name.current = e.target.value
      console.log(name.current)
    }
    const handleLogOut = (evt) => {
      logout(() => {
        history.push("/login");
      });
    };

  /* useEffect(() => {
    getUsers().then((res) => setUsers(res));
  }, [newUser]); */

  /* useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_API_URL);
    socket.on("users", (data) => {
      setNewUser(data);
    });
  }, []); */

  return (
    <div>
     {/*<Button onClick={showButtons} variant="contained" color="primary">
        Create Group
      </Button>*/}
      <button
        className="btn text-decoration-none btn-link   pl-0"
        style={{textDecoration:"none"}}
        onClick={handleLogOut}
      >
        <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
      </button>
      <h3 className=" text-center">Contacts</h3>
      <List className={classes.list}>
      {users && (
        <React.Fragment>
          {users.map((u) => (
            <div>
            <ListItem
              className={classes.listItem}
              button
            >
             <ListItemAvatar>
             <Avatar className={classes.globe}>
                <FaceIcon/>
              </Avatar>
            </ListItemAvatar> 
              <ListItemText onClick={() => userClickHandler(u)}>
                <Typography className={classes.listText}>{u.firstName}&nbsp;{u.lastName}</Typography>
                <Typography className={classes.listText1}>{u.email}</Typography>
              </ListItemText>
              {/* show ? 
              <Button onClick = {() => addGroupMember(u.email)} variant="contained" color="primary">
                Add
              </Button>
              : null */}
              <Button variant="contained" className={classes.listBtn}
              onClick={viewButtonHandler}>View</Button>
            </ListItem>
            <Divider/> 
            
            </div>
          ))}
          {/* show ? 
              <div>
                <TextField onChange = {nameHandler} id="standard-basic" label="Group Name" />
                <Button onClick = {createGroup} variant="contained" color="primary">
                  Create
                </Button>
                </div>
          : null*/ }
          
        </React.Fragment>
      )}
    </List>
    </div>
    
  );
};

export default Users;
