import  axios, { AxiosError } from  "axios"
import  {parseCookies, setCookie} from "nookies"
import { signOut } from "../context/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

let isRefeshing = false;
let failedRequestQueue = []

export  function setupAPIClient(ctx = undefined){
    let  cookies = parseCookies(ctx);

    const  api =  axios.create({
        baseURL: "http://localhost:3333",
        headers: {
            Authorization: `Bearer ${cookies['nextauth.token']}`
        }
    })
    
    api.interceptors.response.use(response => {
        return response;
    },(error: AxiosError)=> {
        if(error.response.status === 401) {
            if(error.response.data?.code === "token.expired"){
                //renovar o token
                cookies = parseCookies(ctx);
                const {'nextauth.refreshToken': refreshToken} = cookies
    
                const originalConfig = error.config;
    
                if(!isRefeshing){
                    isRefeshing = true
                    console.log("refresh")
    
                    api.post('/refresh', {
                        refreshToken
                    }).then(response => {
                        const {token} = response.data
                        
                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 60 * 60 * 24 * 30, // 30 days
                            path: "/"
                        })
        
                        setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken,  {
                            maxAge: 60 * 60 * 24 * 30, // 30 days
                            path: "/"
                        })
                        
                        api.defaults.headers['Authorization'] = `Bearer ${token}`
    
                        failedRequestQueue.forEach(request => request.onSuccess(token))
        
                    }).catch(err => {
                        failedRequestQueue.forEach(request => request.onFailed(err))
                        failedRequestQueue = []
    
                        if(typeof window !== 'undefined') {
                            signOut()
                        }
    
                    } ).finally(() => {
                        isRefeshing = false
                    })
    
                }

                return new Promise((resolve, rejects) => {
                    failedRequestQueue.push({
                        onSuccess: (token: string) => {
                            originalConfig.headers['Authorization'] = `Bearer ${token}`
    
                            resolve(api(originalConfig))
    
                        } ,
                        onFailed: (error: AxiosError) => {
                            rejects(error)
                        }
                })
              })
            }else {
              if(typeof window !== 'undefined') {
                signOut()
              }else {
                return Promise.reject(new AuthTokenError())
              }
            }
        }
    
        return Promise.reject(error);
    })
    return api
}