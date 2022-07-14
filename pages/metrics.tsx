import { withSSRAuth } from "../utils/withSSRAuth"
import { setupAPIClient } from "../service/api"



export  default  function Metrics () {
        return (
            <>
                <h1>Metrics</h1>
            </>
        )
    }

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
        
        
        

    return {
         props: {}
        }
    }, {
        permissions: ['metrics.list'],
        roles: ['administrator'],
    })