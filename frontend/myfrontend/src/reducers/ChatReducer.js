const ChatReducer = (state,action) =>{
    switch(action.type){
        case 'addChat':
            let newMessages = [...state.messages];
            newMessages = [...newMessages, payload];
            return [...state, {
                messages:
            }]
        default:
            return state

    }
}
export default ChatReducer;