import GenericService from "./GenericService.js";
import jwtDecode from "jwt-decode";
class AuthService extends GenericService{
    login = (email, password) => new Promise ((resolve,reject)=>{
        this.post('users/login', {email, password})
        .then(token =>{
            localStorage.setItem("token",token);
            resolve();
        })
        .catch(err => {
            reject()
        })
    });
    register = (name,email, password) => this.post('users/register', {name,email,password})
    logout = () => localStorage.removeItem("token");
    isLoggedIn = () => {
        return localStorage.getItem("token") ? true : false;
      };
      getLoggedInUser = () => {
        try {
          const jwt = localStorage.getItem("token");
          return jwtDecode(jwt);
        } catch (ex) {
          return null;
        }
      };
      isAdmin = () => {
        if (this.isLoggedIn()) {
          if (this.getLoggedInUser().role === "admin") return true;
          else return false;
        } else return false;
      };
    }
    

let authservice = new AuthService();
export default authservice;