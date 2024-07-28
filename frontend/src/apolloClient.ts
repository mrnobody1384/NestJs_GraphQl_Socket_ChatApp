import {ApolloClient,gql,NormalizedCacheObject} from '@apollo/client'
import {WebSocketLink} from '@apollo/client/link/ws'
import { GraphQLError } from 'graphql'

async function refreshToken(client:ApolloClient<NormalizedCacheObject>) {
    try {
        const {data} = await client.mutate({
            mutation: gql`
            mutation RefreshToken {
                refreshToken
            }
            `
        })
        const newAccessToken =data?.refreshToken
        if (!newAccessToken){
            throw new Error("New access token not received")
        }
        return `Bearer ${newAccessToken}`
    }
    catch(error){
        throw new Error("Error getting access token")
    }
}

let retryCount = 0;
    let maxRetry =3

    const wsLink = new WebSocketLink({
        uri: "ws://localhost:3000/graphql",
        options:{
            reconnect: true,
            connectionParams: {
                Autorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
    })

const errorLink = onError(({
    graphQLErrors,
    operation,
    forward,
})=>{
    for (const error of graphQLErrors){
        if (
            error.extentions.code === "UNAUTHENTICATED" && 
            retryCount < maxRetry
        ){
            retryCount++
        }
    }
})