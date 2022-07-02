import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {parseCookies, destroyCookie} from "nookies";
import { AuthTokenError } from "../service/errors/AuthTokenError";



export  function withSSRAuth<P>(fn: GetServerSideProps<P>) {
    return  async (value: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const  cookies  =  parseCookies(value)

        if(!cookies['nextauth.token']) {
            return {
            redirect: {
                destination: "/",
                permanent: false
            }
            }
    
        }
        try {
            return await fn(value)
        } catch (error) {
          if(error instanceof AuthTokenError) {
            destroyCookie(value, 'nextauth.token')
            destroyCookie(value, 'nextauth.refreshToken')
            console.log(error)
          }

          
        }

     
    }
}