const { UserModel } = require("../models/UserModel");
exports.sendFriendRequestController = async (req, res) => {
    const{friendId, myId,myName, myProfileImg ,myEmail} =req.body
    UserModel.findByIdAndUpdate
    (  friendId,{
        $push: {friendRequests: { name: myName, id: myId , email:myEmail, profileImg:myProfileImg}}
    },{
        new:true, useFindAndModify: false
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      UserModel.findByIdAndUpdate(myId,{
           $push: {sentRequests: friendId}
      },{new:true, useFindAndModify: false}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          res.status(400).json({
      errorMessage: "accept FR controller error",
    });
      })

    }
    )
}
exports.cancelFriendRequestController = async (req, res) => {
    const{friendId,  myId } =req.body
         UserModel.findByIdAndUpdate(friendId,
                { $pull: { friendRequests: { id: myId } } },
                {new:true, useFindAndModify: false},(err,result)=>{
        if(err){
           return res.status(400).json({
            errorMessage: "accept FR controller error",
    });
        }
           UserModel.findByIdAndUpdate(myId,
                { $pull: {sentRequests: friendId  }},
                {new:true, useFindAndModify: false})
                .select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
                        return res.status(400).json({
                         errorMessage: "accept FR controller error",
    });
      })
    })
}
exports.acceptFriendRequestController = async (req, res) => {
    const{friendId,friendName,friendProfileImg, friendEmail,chatId,myId,myName,myProfileImg,myEmail} =req.body
      UserModel.findByIdAndUpdate(friendId ,
                { $pull: { sentRequests:   myId  }},
                {new:true, useFindAndModify: false
                 },(err,result)=>{
                  if(err){
                    return res.status(422).json({error:err})
                     }
            UserModel.findByIdAndUpdate( myId ,
                { $pull: {friendRequests: { id: friendId }}},
                { new:true, useFindAndModify: false},
                (err,result)=>{
              if(err){
                   return res.status(422).json({error:err})
                      }
             UserModel.findByIdAndUpdate(friendId ,
                {$push: { friends: {
                            name: myName,
                            id: myId,
                            profileImg: myProfileImg,
                            email:myEmail,
                            chatId: chatId
                        }}}
            ,{ new:true, useFindAndModify: false},(err,result)=>{
                  if(err){
                   return res.status(422).json({error:err})
                         }
            UserModel.findByIdAndUpdate(myId,
                {$push: {
                        friends: {
                            name: friendName,
                            id: friendId,
                            profileImg: friendProfileImg,
                            email:friendEmail,
                            chatId: chatId
                        }
                    }
                },
            {new:true, useFindAndModify: false})
            .then(result=>{
          res.json(result)
      }).catch(err=>{
                        return res.status(400).json({
                         errorMessage: "accept FR controller error",
                });
             })
            })          
          })          
        })
}
exports.rejectFriendRequestController = async (req, res) => {
        const{friendId, myId} =req.body
         UserModel.findByIdAndUpdate(friendId,
                { $pull: { sentRequests: myId   }},
                {new:true, useFindAndModify: false},(err,result)=>{
                if(err){
                 return res.status(400).json({
                 errorMessage: "accept FR controller error",
                     })}
                     
        UserModel.findByIdAndUpdate( myId ,
                { $pull: {friendRequests: { id: friendId }}},
                {new:true, useFindAndModify: false})
                .then(result=>{
          res.json(result)
      }).catch(err=>{
                        return res.status(400).json({
                         errorMessage: "accept FR controller error",
        });
      })
    })
}
exports.deleteFriendController = async (req, res) => {
    const{friendId, myId} =req.body
          UserModel.findByIdAndUpdate(friendId ,
            { $pull: { friends: { id: myId } }}
            ,{new:true, useFindAndModify: false},(err,result)=>{
              if(err){
               return res.status(400).json({
                 errorMessage: "accept FR controller error",
    })}
             UserModel.findByIdAndUpdate(myId,
                { $pull: { friends: { id: friendId } }},
                 {new:true, useFindAndModify: false})
                .then(result=>{
                  res.json(result)
                 }).catch(err=>{
                        return res.status(400).json({
                         errorMessage: "accept FR controller error",
    });
      })})
}
exports.getFriendRequestsController =  async (req, res) => {

 try {
    let data = await UserModel.findById(req.params.id, {friendRequests:true});
    if (!data)
      return res.status(400).json({
        errorMessage: "ID is not Present",
      });
    return res.send(data.friendRequests);
  } catch (err) {
    return res.status(400).json({
      errorMessage: "Invalid ID",
    });
  }
    
};
exports.getSentFriendRequestsController =  async (req, res) => {

 try {
    let data = await UserModel.findById(req.params.id);
    if (!data)
      return res.status(400).json({
        errorMessage: "ID is not Present",
      });
    return res.send(data);
  } catch (err) {
    return res.status(400).json({
      errorMessage: "Invalid ID",
    });
  }
    
};

exports.getAllFriendController =  async (req, res) => {

 try {
    let data = await UserModel.findById(req.params.id, {friends:true});
    if (!data)
      return res.status(400).json({
        errorMessage: "ID is not Present",
      });
    return res.send(data.friends);
  } catch (err) {
    return res.status(400).json({
      errorMessage: "Invalid ID",
    });
  }
    
};