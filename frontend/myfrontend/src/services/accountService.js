import GenericService from "./GenericService";
class AccountService extends GenericService {
  constructor() {
    super();
  }
   accountActivation = (data) => this.post("users/activation", data);
   forgotPassword = (data) => this.put("users/forgot-password", data);
   resetPassword = (data) => this.put("users/reset-password", data);
   profileSetup =(data)=>this.post("users/profile-setup",data);
}
let accountService = new AccountService();
export default accountService;