const ChatReducer = (state,action) =>{
    switch(action.type){
        case 'addChatRecipient':
            return [...state, {
                names: action.chatRecipients.names
            }]
        default:
            return state

    }
}
export default ChatReducer;