import Cookies from "js-cookie";
export const setCookie = (key, value) => {
  Cookies.set(key, value, { expires: 1 });
};
export const getCookie = (key) => {
  return Cookies.get(key);
};
export const removeCookie = (key) => {
  return Cookies.remove(key);
};