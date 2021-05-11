//abcd
const {validateSendFriendRequest,
    validateCRFriendRequest,
    validateDeleteFriend,
   validateAcceptFriendRequest
}= require("../models/UserModel");
function sendFriendRequestValidation(req, res, next) {
 let { error } = validateSendFriendRequest(req.body);

 if (error) {
   const firstError = error.details[0].message;
   return res.status(400).json({
     errorMessage: firstError,
   });
 }
 next();
}
//CR =Cancel Reject 
function CRFriendRequestValidation(req, res, next) {
 let { error } = validateCRFriendRequest(req.body);

 if (error) {
   const firstError = error.details[0].message;
   return res.status(400).json({
     errorMessage: firstError,
   });
 }
 next();
}
function deleteFriendValidation(req, res, next) {
 let { error } = validateDeleteFriend(req.body);

 if (error) {
   const firstError = error.details[0].message;
   return res.status(400).json({
     errorMessage: firstError,
   });
 }
 next();
}
function acceptFriendRequestValidation(req, res, next) {
 let { error } = validateAcceptFriendRequest(req.body);

 if (error) {
   const firstError = error.details[0].message;
   return res.status(400).json({
     errorMessage: firstError,
   });
 }
 next();
}
module.exports.sendFriendRequestValidation=sendFriendRequestValidation;
module.exports.CRFriendRequestValidation=CRFriendRequestValidation;
module.exports.deleteFriendValidation=deleteFriendValidation;
module.exports.acceptFriendRequestValidation=acceptFriendRequestValidation;