import React from "react";
import Toast from 'react-bootstrap/Toast'

const Notification = ({msg}) => {
  
  return (
    <Toast>
    <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
        <strong className="mr-auto">TalkSee</strong>
    </Toast.Header>
    <Toast.Body>{msg}</Toast.Body>
    </Toast>
    );
};
export default Notification;
