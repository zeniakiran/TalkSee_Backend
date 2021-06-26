import React, { useState, useEffect,useContext, useRef } from "react";
import AlertBar from "../Alerts/AlertBar";
import LinearBuffer from "../Alerts/ProgressBar";
import PageTitle from "./pageTitle";
import Select from "react-select";
import { makeStyles } from '@material-ui/core/styles';
import Resizer from 'react-image-file-resizer';
import { grey, cyan} from '@material-ui/core/colors';
import {Button, Grid, Hidden} from "@material-ui/core";
import Header from "./Header";
import axios from 'axios';
import accountService from "../../../services/accountService";
import { isAuthenticated } from "../clientStorages/auth";
import {SocketContext} from '../../../context/SocketContext';
 
import io from "socket.io-client";
import Webcam from "react-webcam";
import SideBar from "./SideBar";
const useStyles = makeStyles({
  
  textfield: {
    marginTop: "2rem",
  },
  Submitbtn: {
    marginTop: "0.6rem",
  },
});



const UpdateProfileSetup = ( ) => {
    const classes = useStyles();
    const myId=isAuthenticated()._id;
    let uId = JSON.parse(localStorage.getItem("user")).email;
    const {setSocket,roomJoin,messageEvent, friendReq} = useContext(SocketContext);
    let clientSocket1 = useRef()
    const webcamRef = React.useRef(null);
    const [capturedPic, setCapturedPic]=React.useState(false);
const options = [
  { label: 'Afrikaans',value:'af' },
  { label: 'Albanian',value:'sq'},
  { label: 'Amharic',value:'am'},
  { label: 'Arabic',value:'ar'},
  { label: 'Armenian',value:'hy'},
  { label: 'Azerbaijani',value:'az'},
  { label: 'Basque',value:'eu'},
  { label: 'Belarusian',value:'be'},
  { label: 'Bengali',value:'bn'},
  { label: 'Bosnian',value:'bs'},
  { label: 'Bulgarian',value:'bg'},
  { label: 'Catalan',value:'ca'},
  { label: 'Cebuano',value:'ceb'},
  { label: 'Chichewa',value:'ny'},
  { label: 'Chinese',value:'zh-cn'},
  { label: 'Corsican',value:'co'},
  { label: 'Croatian',value:'hr'},
  { label: 'Czech',value:'cs'},
  { label: 'Danish',value:'da'},
  { label: 'Dutch',value:'nl'},
  { label: 'English',value:'en'},
  { label: 'Esperanto',value:'eo'},
  { label: 'Estonian',value:'et'},
  { label: 'Filipino',value:'tl'},
  { label: 'Finnish',value:'fi'},
  { label: 'French',value:'fr'},
  { label: 'Danish',value:'da'},
  {label: 'Frisian',value: "fy"},
  {label: 'Galician',value: "gl"},
  {label: 'Georgian',value: "ka"},
  {label: 'German',value: "de"},
  {label: 'Greek',value: "el"},
  {label: 'Gujarati',value: "gu"},
  {label: 'Haitian creole',value: "ht"},
  {label:'Hausa',value: "ha"},
  {label:'Hawaiian',value: "haw"},
  {label:'Hebrew',value: "iw"},
  {label: 'Hindi',value: "hi"},
  {label:'Hmong',value: "hmn"},
  {label:'Hungarian',value: "hu"},
  {label:'Icelandic',value: "is"},
  {label:'Igbo',value: "ig"},
  {label:'Indonesian',value: "id"},
  {label:'Irish',value: "ga"},
  {label:'Italian',value: "it"},
  {label:'Japanese',value: "ja"},
  {label:'Javanese',value: "jw"},
  {label:'Kannada',value: "kn"},
  {label:'Kazakh',value: "kk"},
  {label:'Khmer',value:'km'},
  {label:'Korean',value:'ko'},
  {label:'Kurdish',value:'ku'},
  {label: 'Kyrgyz',value: "ky"},
  {label: 'Lao',value: "lo"},
  {label: 'Latin',value: "la"},
  {label: 'Latvian',value: "lv"},
  {label: 'Lithuanian',value: "lt"},
  {label: 'Luxembourgish',value: "lb"},
  {label: 'Macedonian',value: "mk"},
  {label:'Malagasy',value: "mg"},
  {label:'Malay',value: "ms"},
  {label:'Malayalam',value: "ml"},
  {label: 'Maltese',value: "mt"},
  {label:'Maori',value: "mi"},
  {label:'Marathi',value: "mr"},
  {label:'Mongolian',value: "mn"},
  {label:'Myanmar (burmese)',value: "my"},
  {label:'Nepali',value: "ne"},
  {label:'Norwegian',value: "no"},
  {label:'Odia',value: "or"},
  {label:'Pashto',value: "ps"},
  {label:'Persian',value: "fa"},
  {label:'Polish',value: "pl"},
  {label:'Portuguese',value: "pt"},
  {label:'Punjabi',value: "pa"},
  {label :'Romanian', value:"ro"},
  {label :'Russian', value:"ru"},
  {label:'Samoan',value: "sm"},
  {label:'Scots gaelic',value: "gd"},
  {label:'Serbian',value: "sr"},
  {label:'Sesotho',value: "st"},
  {label:'Shona',value: "sn"},
  {label:'Sindhi',value: "sd"},
  {label:'Sinhala',value: "si"},
  {label:'Slovak',value: "sk"},
  {label:'Slovenian', value:"sl"},
  {label:'Somali', value:"so"},
  {label:'Spanish', value:'es' },
  {label:'Sundanese',value: "su"},
  {label:'Swahili',value: "sw"},
  {label:'Swedish',value: "sv"},
  {label:'Tajik',value: "tg"},
  {label:'Tamil',value: "ta"},
  {label:'Telugu',value: "te"},
  {label:'Thai',value: "th"},
  {label:'Turkish',value: "tr"},
  {label :'Ukrainian', value:"uk"},
  {label:'Urdu',value: "ur"},
  {label :'Uyghur', value:"ug"},
  {label:'Uzbek', value:'uz' },
  {label:'Vietnamese',value: "vi"},
  {label :'Welsh', value:"cy"},
  {label:'Xhosa',value: "xh"},
  {label :'Yiddish', value:"yi"},
  {label:'Yoruba', value:'yo' },
  {label:'Zulu',value: "zu"},
  
];
 
    const [values, setValues] = useState({
    img: "",
    language:"",
    errorMessage: "",
    successMsg:"",
    infoMessage:"",
    loading: false,
  });
  const { img,language, successMsg, errorMessage,infoMessage, loading } = values;
 
   window.onload = () => {
    friendReq()
    messageEvent()
    let did = JSON.parse(localStorage.getItem('user'))._id
    roomJoin(did)
    clientSocket1 = io("http://127.0.0.1:5000")
    setSocket((s)=>{
      s = clientSocket1
      s.on('connect' , () => {
        console.log("connected",s.id);
        s.emit("adduser",{id:s.id, name: uId})
      });
      return s;
    })
  };

 useEffect(() => {
     accountService.getMyAccount(myId).then((data) => {
     setValues({ ...values , img: data.profileImg, language:data.langPreference});
    }).catch((err) => {
           setValues({ ...values , errorMessage:err.response.data.errorMessage}); 
        });
  }, []);

const resizeFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
    uri => {resolve(uri);},'base64' );
});
const capture =  React.useCallback(() => {
   try{
      const imageSrc = webcamRef.current.getScreenshot();
       setValues({...values, infoMessage: "Picture Captured"}); 
       setCapturedPic(true);
       const data = new FormData();
       data.append("file", imageSrc);
       axios.post("http://127.0.0.1:5000/webcam-face-detection",data)
         .then(async (response) => {
          setValues({ ...values , errorMessage :"", successMsg:response.data.successMessage})
           setValues({...values, infoMessage: "Loading.... "});
           data.append("file", imageSrc);
           data.append("upload_preset", "TalkSee");
          fetch("https://api.cloudinary.com/v1_1/fariha31/image/upload",
              { method: "PUT",
                body: data,
             } ).then(response => response.json())
      .then(data =>   setValues({ ...values , img: data.url}))
      .catch(err => console.error('Error:', err));;   
           }
        )
         }
 catch(err)
     {setValues({...values, errorMessage: "error in uploading photo"}); }
    
    },
    [webcamRef]
  );
 const uploadImage = async (e) => {
  try {
           const imageFile = e.target.files[0];
           const data = new FormData();
           data.append("file", imageFile);
           axios.post("http://127.0.0.1:5000/",data).
           then(async (response) => {
           setValues({ ...values , errorMessage :"", successMsg:response.data.successMessage})
            const compressedImage = await resizeFile(imageFile);
           setValues({...values, infoMessage: "Loading...."});
           data.append("file", compressedImage);
           data.append("upload_preset", "TalkSee");
           const res = await fetch("https://api.cloudinary.com/v1_1/fariha31/image/upload",
              { method: "PUT",
                body: data,
             } );   
           const file =  await res.json();
           setValues({ ...values , img: file.secure_url});
        })
        .catch((err) => {
            setValues({ ...values , errorMessage:err.response.data.errorMessage}); 
        });
      }
 catch(err)
     {setValues({...values, errorMessage: "error in uploading photo"}); }
}
const updateProfile =()=>{
  accountService.updateProfileSetup(myId,{profileImg: img, langPreference: language})
 .then((response) => {
          localStorage.setItem("user", JSON.stringify(response.userData));
          setValues({
            ...values,
            errorMessage: false,
            successMsg: response.successMessage,
            loading: false,
          });
           
        })
         .catch((err) => {
           setValues({ ...values , errorMessage:err.response.data.errorMessage}); 
        });
}
 
  const ProfilePage = () =>( 
    <Grid container>
      <Grid item xs={1} sm={4} md={4}></Grid>
      <Grid item xs={10} sm={4} md={4}>
  <div className="profile-page">
      <div className="profile-container">
          <div className="img-holder">
             <img src={img} className="profile-img"/>
              </div>
             <input type="file" accept="image/*" name="image-upload" id="input" onChange={uploadImage}  />
             <div className="label">
            <label className="image-upload" htmlFor="input">
						<i className="material-icons">add_photo_alternate</i>
						Choose Profile Photo
					</label>
                 </div> 
             <div className="label">   
             <button className="take-photo loginbtn"  data-toggle="modal" data-target="#exampleModalCenter" onClick={()=>setCapturedPic(false)}>
               <i className="material-icons" style ={{marginRight:"0.2rem"}}>photo_camera</i>
               Take Photo</button> 
              </div>
              <Select
                    style={{ width: 210, padding: "0.4rem" }}
                    placeholder="Select Language ---"
                    value={options.find(c => c.value === language)}
                    className={classes.textfield}
                    options={options}
                    onChange={(e) => { 
                      setValues({
                        ...values,
                        language:e.value ,
                      });
                      
                    }}
                  />
                   <Button
             style={{ color: grey[50],
              backgroundColor:cyan[600],
              fontWeight:"bold", 
              fontSize:"1rem",
              borderRadius:"0.5rem" , 
              marginTop: "1rem",
              marginBottom: "0.8rem",
              padding: "0.5rem",
              textTransform:"capitalize"
               }}
            className= "loginbtn"
            variant="contained"
            fullWidth
            onClick={updateProfile}
            
          >
            Update Profile
          </Button>
                   
      </div> 
                
  
<div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLongTitle">Take Photo</h3>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div  className="webcam-container">
         <Webcam  
        audio={false}
        height= {200}
       width ={460}
        ref={webcamRef}
        screenshotFormat="image/jpeg" />
        </div>
      </div>
       
        {capturedPic ? (<div className="modal-footer"> 
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div> ):
        (<div className="modal-footer"> 
        <button  className="take-photo loginbtn" onClick ={capture}>
          <i className="material-icons" style ={{marginRight:"0.2rem"}}>
            photo_camera</i>Capture photo</button> </div>)
        }
    </div>
  </div>
</div>             
  </div>
  </Grid>
  <Grid item xs={1} sm={4} md={3}></Grid>
  </Grid>
)
return (
 <div  style={{height:"100vh"}} className="back_divs">    
    {loading && <LinearBuffer />}
        <Grid container>
          <Hidden only={['xs', 'sm']}>
          <Grid item     md={2}><SideBar/></Grid>
          </Hidden>
           <Hidden only={['md', 'lg']}>
          <Grid item xs={12} sm={12}><Header/></Grid>
          </Hidden>
       <Grid item  xs={12} sm={12} md={10}>
     <PageTitle name= {"Update Profile "}/>
      {errorMessage && (
        <AlertBar type="error" message={errorMessage} autoClose={3000} />
      )}
       {infoMessage && (
        <AlertBar type="info" message={infoMessage} autoClose={8000} />
      )}
      {successMsg && (
        <AlertBar type="success" message={successMsg} autoClose={2500} />
      )}
      {ProfilePage()}
      </Grid>
       </Grid>
    </div>
    )
};

export default UpdateProfileSetup;
