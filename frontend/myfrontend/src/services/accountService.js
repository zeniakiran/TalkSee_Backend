import GenericService from "./GenericService";
class AccountService extends GenericService {
 
   accountActivation = (data) => this.post("users/activation", data);
   forgotPassword = (data) => this.put("users/forgot-password", data);
   resetPassword = (data) => this.put("users/reset-password", data);
   profileSetup =(data)=>this.post("users/profile-setup",data);
   updateProfileSetup = (_id, data) =>this.put("users/update-profile-setup/" + _id, data);
   getMyAccount =(id) => this.get("users/my-account/" + id);
}
let accountService = new AccountService();
export default accountService;