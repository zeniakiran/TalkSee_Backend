import axios from "axios";
axios.defaults.headers.common["x-auth-token"] =localStorage.getItem("token");
const IP_URL = localStorage.getItem('IP_URL')
export const signup = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(process.env.REACT_APP_IP_URL+"api/users/signup", data);
  return response;
};
export const login = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(process.env.REACT_APP_IP_URL+"api/users/login", data);
  return response;
};
