import axios from "axios";
axios.defaults.baseURL =  "/api/";
//axios.defaults.baseURL = process.env.REACT_APP_IP_URL+"api/";
axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
class GenericService {
    get = (url) => {
       return new Promise((resolve,reject) => {
            axios.get(url)
            .then((res) => {
              resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
    getMessage = (url,email) => {
        return new Promise((resolve,reject) => {
             axios.get(url,{params:{email: email}})
             .then((res) => {
               resolve(res.data);
             })
             .catch((err) => {
                 reject(err);
             });
         });
     }

    post = (url,data) => {
        return new Promise((resolve,reject) => {
            axios.post(url,data).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                console.log("Errrr");
                reject(err);
            });
            });
        }
    put = (url,data)=>{
        return new Promise((resolve,reject)=>{
            axios.put(url,data).then((res)=>{
                resolve(res.data)
            }).catch((err)=>{
                reject(err)
            });
            });
    }
    delete = (url)=>{
        return new Promise((resolve,reject)=>{
            axios.delete(url).then((res)=>{
                resolve(res.data)
            }).catch((err)=>{
                reject(err)
            });
            });
    }
}
export default GenericService;