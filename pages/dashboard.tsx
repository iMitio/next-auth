import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { withSSRAuth } from "../utils/withSSRAuth"
import { api } from "../service/apiClient"
import { setupAPIClient } from "../service/api"
import { useCan } from "../hooks/useCan"
import {Can} from "../components/Can"


export  default  function Dashboard () {
    const {user, signOut} = useContext(AuthContext)

    const useCanSeeMetrics = useCan({
        roles: ['administrator', 'editor']
    })

    useEffect(() => {
        api.get("/me")
        .then(respose => console.log(respose))
        .catch(err => console.log(err))
    }, [])

        return (
            <>
                <h1>Dashboard : {user?.email}</h1>
                <button
                    onClick={signOut}
                >
                    Sign Out
                </button>
                <Can permissions={['metrics.list']}>
                    <div>Métricas</div>
                </Can>
            </>
        )
    }


    export const getServerSideProps = withSSRAuth(async (ctx) => {
        const apiClient = setupAPIClient(ctx)
        
        const response = await apiClient.get('/me')
        console.log(response.data)

        return {
            props: {}
        }
    })