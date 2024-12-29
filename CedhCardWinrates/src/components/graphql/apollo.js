import { ApolloClient, InMemoryCache } from "@apollo/client/core";

const client = new ApolloClient({
  uri: "https://edhtop16.com/api/graphql",
  cache: new InMemoryCache(),
  name: "edhTop16Client",
  fetchOptions: {
    mode: "no-cors",
  },
});
export default client;