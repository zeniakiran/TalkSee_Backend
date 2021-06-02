import GenericService from "./GenericService";
class FriendService extends GenericService {
  
  sendRequest   = (data) => this.post("friends/send-friend-request", data);
  cancelRequest = (data) => this.post("friends/cancel-friend-request", data);
  acceptRequest = (data) => this.post("friends/accept-friend-request", data);
  rejectRequest = (data) => this.post("friends/reject-friend-request", data);
  deleteFriend  = (data) => this.post("friends/delete-friend", data);
  getFriendRequest =(id) =>  this.get("friends/my-friend-requests/" + id);
  getSentFriendRequest =(id) =>  this.get("friends/sent-friend-requests/" + id);
  getAllFriends =(id) =>  this.get("friends/my-friends-list/" + id);
  getFriendRequestsCount =(id)=> this.get("friends/my-friend-requests-count/" + id);
}

let friendService = new FriendService();
export default friendService;