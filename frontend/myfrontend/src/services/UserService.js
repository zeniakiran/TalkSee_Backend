import GenericService from "./GenericService";
class UserService extends GenericService{

    getUsers = () => {
        return this.get("users");
    }
    getUserByEmail = (id) =>{
        return this.get("users/userbyemail/"+id);
    }
    getUserNameByEmail = (id) =>{
        return this.get("users/usernamebyemail/"+id);
    }
    
}

let userservice = new UserService();
export default userservice;