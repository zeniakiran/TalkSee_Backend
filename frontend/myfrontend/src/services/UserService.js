import GenericService from "./GenericService";
class UserService extends GenericService{

    getUsers = () => {
        return this.get("users");
    }
    getUserByEmail = (data) =>{
        return this.post("users/userbyemail",data);
    }
    getUserNameByEmail = (id) =>{
        return this.get("users/usernamebyemail/"+id);
    }
    
}

let userservice = new UserService();
export default userservice;