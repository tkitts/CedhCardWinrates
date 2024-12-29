import {
  ApolloClient,
  type ApolloClientOptions,
  HttpLink,
  InMemoryCache,
  type NormalizedCacheObject
} from '@apollo/client/core'
import type { App } from 'vue'

// HTTP connection to the API
const createHttpLink = () =>
  new HttpLink({
    // URI to use when fetching operations.
    uri: 'http://localhost:4000',
    // Headers to be sent on each request.
    headers: {
      apiKey: 'c0944e06-4965-49fa-b049-773466b2608a',
      'app-id': 'vue-graphql'
    }
  })

// Create the apollo client
const createApolloClient = (app: App) => {
  // Cache implementation
  const cache = new InMemoryCache()

  const link = createHttpLink()

  // Apollo client options
  const apolloConfig: ApolloClientOptions<NormalizedCacheObject> = { link, cache }

  return new ApolloClient(apolloConfig)
}