import React, { useState, useEffect } from "react";
import AlertBar from "../Alerts/AlertBar";
import LinearBuffer from "../Alerts/ProgressBar";
import PageTitle from "./pageTitle";
import Select from "react-select";
import { makeStyles } from '@material-ui/core/styles';
import Resizer from 'react-image-file-resizer';
import { grey, cyan} from '@material-ui/core/colors';
import {Button} from "@material-ui/core";
import axios from 'axios';
import accountService from "../../../services/accountService";
import "./profile.css"
const useStyles = makeStyles({
  
  textfield: {
    marginTop: "2rem",
  },
  Submitbtn: {
    marginTop: "0.6rem",
  },
});



const ProfileSetup = ( {match}) => {
    const classes = useStyles();
const options = [
  { label: 'Afrikaans',value:'af' },
  { label: 'albanian',value:'sq'},
  { label: 'amharic',value:'am'},
  { label: 'arabic',value:'ar'},
  { label: 'armenian',value:'hy'},
  { label: 'azerbaijani',value:'az'},
  { label: 'basque',value:'eu'},
  { label: 'belarusian',value:'be'},
  { label: 'bengali',value:'bn'},
  { label: 'belarusian',value:'be'},
  { label: 'belarusian',value:'be'},
  {label: 'Urdu - اردو',value: "ur"},
  {label: 'Hindi - हिन्दी',value: "hi"},
  {label:'English (UK)',value: "en"},
  
   
];
    const [values, setValues] = useState({
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    language:"",
    token:"",
    errorMessage: "",
    successMsg:"",
    infoMessage:"",
    loading: false,
  });
  const { img,language,token, successMsg, errorMessage,infoMessage, loading } = values;
useEffect(() => {
        let token = match.params.token
        if(token) {
            setValues({...values, token})
        }
    }, [])

const resizeFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
    uri => {resolve(uri);},'base64' );
});
 const uploadImage = async (e) => {
  try {
           const imageFile = e.target.files[0];
           const data = new FormData();
           data.append("file", imageFile);
           //axios.post("http://127.0.0.1:5000/",data)
        // .then(async (response) => {
           setValues({ ...values , successMsg:"response.data.successMessage"})
            const compressedImage = await resizeFile(imageFile);
           setValues({...values, infoMessage: "Loading...."});
           data.append("file", compressedImage);
           data.append("upload_preset", "TalkSee");
           const res = await fetch("https://api.cloudinary.com/v1_1/fariha31/image/upload",
              { method: "POST",
                body: data,
             } );   
           const file =  await res.json();
           setValues({ ...values , img: file.secure_url});
        //})
/*         .catch((err) => {
            setValues({ ...values , errorMessage:err.response.data.errorMessage}); 
        }); */}
 catch(err)
     {setValues({...values, errorMessage: "error in uploading photo"}); }
}
const SetProfile =()=>{
  accountService.profileSetup({profileImg: img, langPreference: language, token})
 .then((response) => {
          setValues({
            ...values,
            img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            language:"",
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
                  
              <Select
                    style={{ width: 210, padding: "0.4rem" }}
                    placeholder="Select Language ---"
                    value={options.find(c => c.label === language)}
                    className={classes.textfield}
                    options={options}
                    onChange={(e) => {
                      console.log(e)
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
              borderRadius:"0.5rem" , 
              marginTop: "1.5rem",
              padding: "0.5rem",
               }}
            className= "loginbtn"
            variant="contained"
            fullWidth
            onClick={SetProfile}
            
          >
            Set Profile
          </Button>
      </div>             
  </div>
)
return (<div>
    
    {loading && <LinearBuffer />}
     <PageTitle name= {"Profile Setup"}/>
      {errorMessage && (
        <AlertBar type="error" message={errorMessage} autoClose={4000} />
      )}
       {infoMessage && (
        <AlertBar type="info" message={infoMessage} autoClose={8000} />
      )}
      {successMsg && (
        <AlertBar type="success" message={successMsg} autoClose={4000} />
      )}
      {ProfilePage()}
    </div>
    )
};

export default ProfileSetup;