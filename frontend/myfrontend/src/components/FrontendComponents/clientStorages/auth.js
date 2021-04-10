import { setCookie, getCookie, removeCookie } from "./cookies";
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "./localStorage";
export const authentication = (token, user) => {
  setCookie("token", token);
  setLocalStorage("user", user);
};
export const isAuthenticated = () => {
  if (getCookie("token") && getLocalStorage("user"))
    return getLocalStorage("user");
};
export const logout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};