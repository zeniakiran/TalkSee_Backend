const express = require("express");
const router = express.Router();
const { 
    sendFriendRequestValidation,
    CRFriendRequestValidation,
    deleteFriendValidation,
    acceptFriendRequestValidation
 }=require("../../middlewares/validateFriend")
const { 
    sendFriendRequestController,
    cancelFriendRequestController,
    acceptFriendRequestController,
    rejectFriendRequestController,
    deleteFriendController,
    getFriendRequestsController,
    getSentFriendRequestsController,
    getAllFriendController
 } = require("../../controller/authFriend");

router.post("/send-friend-request", sendFriendRequestValidation, sendFriendRequestController);
router.post("/cancel-friend-request",CRFriendRequestValidation,cancelFriendRequestController);
router.post("/accept-friend-request",acceptFriendRequestValidation, acceptFriendRequestController);
router.post("/reject-friend-request",CRFriendRequestValidation,rejectFriendRequestController);
router.post("/delete-friend",deleteFriendValidation, deleteFriendController );
router.get("/my-friend-requests/:id",getFriendRequestsController)
router.get("/sent-friend-requests/:id",getSentFriendRequestsController)
router.get("/my-friends-list/:id",getAllFriendController)
module.exports = router;