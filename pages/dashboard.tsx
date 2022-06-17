import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { setupAPIClient } from "../service/api"
import { api } from "../service/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"

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


    export  const  getServerSideProps = withSSRAuth(async (value) => {
        const apiClient = setupAPIClient(value)
        const response = await apiClient.get("/me")

        console.log(response.data)
       

        return {
            props: {}
        }
    })