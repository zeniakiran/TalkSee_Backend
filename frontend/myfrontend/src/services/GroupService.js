import GenericService from "./GenericService";
class GroupService extends GenericService{

    getgroups = () => {
        return this.get("chatapi/groupchat");
    }
    createGroup = (data) => {
        return this.post("chatapi/groupchat/",data);
    }
    getGroupById = (groupId) =>{
        return this.get("chatapi/groupchat/"+groupId)
    }
    
}

let groupservice = new GroupService();
export default groupservice;