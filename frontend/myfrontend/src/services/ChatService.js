import GenericService from "./GenericService";
class ChatService extends GenericService{

    getMessages = () => {
        return this.get("chatapi");
    }
    createMessage = (data) => {
        return this.post("chatapi",data);
    }
    getMessagesbyEmail = (from,to) =>{
        return this.get("chatapi/msgbyemail/"+from+" "+to)
    }
    getMessagesbyUserId = (userId) =>{
        return this.get("chatapi/msgbyuserid/"+userId)
    }
    getChatRecipients = (userId) =>{
        return this.get("chatapi/chatrecipients/"+userId)
    }
    getLastMsg = (from,to) =>{
        return this.get("chatapi/lastmsg/"+from+" "+to)
    }
    deleteMessage = (id) =>{
        return this.delete("chatapi/"+ id)
    }
    changeMessageType = (data,id)=>{
        return this.put("chatapi/"+id, data)
    }
    offlinemessages = (id)=>{
        return this.get("chatapi/offlinemessages/"+id);
    }
}

let chatservice = new ChatService();
export default chatservice;