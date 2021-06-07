export const deletePermission = (state, action) => {
     switch (action.type) {
    case "updatePermission":
      return {state: action.value };
    default:
      return state;
  }
}