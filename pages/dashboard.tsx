import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { withSSRAuth } from "../utils/withSSRAuth"
import { api } from "../service/apiClient"
import { setupAPICleint } from "../service/api"
import { AuthTokenError } from "../service/errors/AuthTokenError"
import { destroyCookie } from "nookies"


export  default  function Dashboard () {
        const {user} = useContext(AuthContext)

    useEffect(() => {
        api.get("/me")
        .then(respose => console.log(respose))
        .catch(err => console.log(err))
    }, [])

        return (
            <h1>Dashboard : {user?.email}</h1>
        )
    }


    export const getServerSideProps = withSSRAuth(async (ctx) => {
        const apiClient = setupAPICleint(ctx)
        
        const response = await apiClient.get('/me')


        return {
            props: {}
        }
    })