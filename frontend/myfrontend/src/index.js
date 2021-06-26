import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import Pusher from 'pusher-js';
//import Reducer from './Redux/reducers/chat_reducers';
 
//Pusher.logToConsole = true;

//useEffect (()=>{
  /* const pusher = new Pusher('18cb37e3146179a6a80e', {
  cluster: 'ap2',
  authEndpoint: 'http://localhost:5000/api/chatapi/pusher/auth'
}); */
/* usher.connection.bind('connected', function () {
  // attach the socket ID to all outgoing Axios requests
  axios.defaults.headers.common['X-Socket-Id'] = pusher.connection.socket_id;
  console.log("id:",pusher.connection.socket_id)
}); */
//},[])
/* var channel = pusher.subscribe('private-my-channel');
channel.bind('my-event', function(data) {
  console.log("in bind")
  alert(JSON.stringify(data));
  console.log("pusher data:",data)
}); */

//const myStore = createStore(Reducer, window.__REDUX_DEVTOOLS_EXTENSION__ &&
                            //window.__REDUX_DEVTOOLS_EXTENSION__() );

/* ReactDOM.render(
  <Provider
        store={myStore}
        >
        <App />
  </Provider>
    
  ,
  document.getElementById('root')
); */
ReactDOM.render(<App />,document.getElementById('root'));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
