import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import { ApolloLink } from '@apollo/client/core';

const headLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      //"Access-Control-Allow-Origin": "https://sandbox.embed.apollographql.com",
      //"Access-Control-Allow-Credentials": true
      'apollographql-client-name': undefined,
    }
  })
  return forward(operation);
})
//used to use https://proxy.cors.sh/https://edhtop16.com/api/graphql
//in dev use /api
//considering https://go.x2u.in/proxy?email=tkitts1721@gmail.com&apiKey=5273dd28&url=
//or maybe https://corsproxy.io/?url=https://edhtop16.com/api/graphql
const httpLink = new HttpLink({ uri: process.env.NODE_ENV === 'development' ? "/api" : 'https://api.allorigins.win/raw?url=https://edhtop16.com/api/graphql'});

const client = new ApolloClient({
  link: headLink.concat(httpLink),
  cache: new InMemoryCache(),
  name: "edhTop16Client",
  fetchOptions: {
    mode: "no-cors",
  },
});
export default client;