 import React, { createContext, useReducer, useEffect } from "react";
import { deletePermission } from "../reducers/DeletePermissionReducer";
export const DeletePermission = createContext();
const DeletePermissionProvider = (props) => {
  const [deletemsg, dispatch] = useReducer(deletePermission, "1", () => {
    const localData = localStorage.getItem("deletion");
    return localData ? JSON.parse(localData) : "";
  });
  useEffect(
    () => {localStorage.setItem("deletion",  JSON.stringify(deletemsg))},
    [deletemsg]
  );
  return (
    <DeletePermission.Provider value={{ deletemsg, dispatch }}>
      {props.children}
    </DeletePermission.Provider>
  );
};
export default DeletePermissionProvider;