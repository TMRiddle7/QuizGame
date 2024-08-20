import { ApolloClient, InMemoryCache, HttpLink ,split} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { LIST_ONLINE_PLAYERS, LIST_MESSAGES } from '../graphql/queries';
import { SEND_MESSAGE } from '../graphql/mutation';
import { getMainDefinition } from '@apollo/client/utilities';
import { provideApolloClient } from '@vue/apollo-composable';
import fetch from 'node-fetch';

global.fetch = fetch;

    export const subClient = new ApolloClient({
        link: new WebSocketLink({
            uri: 'wss://murl5sdvjffqdastco4lptkyda.appsync-realtime-api.us-east-1.amazonaws.com/graphql', // Replace with your AppSync WebSocket endpoint
            options: {
              reconnect: true,
              connectionParams: {
                headers: {
                  'x-api-key': 'da2-e62odg4hqvbfjjxk3tnawbbyhu', // Replace with your AppSync API key
                },
              },
            },
          }),   
    cache: new InMemoryCache(),
    })
    console.log(subClient);
    provideApolloClient(subClient);

  const client = new ApolloClient({
    link :new HttpLink({
        uri: 'https://murl5sdvjffqdastco4lptkyda.appsync-api.us-east-1.amazonaws.com/graphql',
        headers: {
          'x-api-key': 'da2-e62odg4hqvbfjjxk3tnawbbyhu', // Corrected API key value
        },
      }),
    cache: new InMemoryCache(),
  });
  
  // Function to fetch online players
  export const fetchOnlinePlayers = async () => {
    try {
      const response = await client.query({ query: LIST_ONLINE_PLAYERS });
      return response.data;
    } catch (error) {
      console.error('ApolloError:', error);
      if (error.networkError) {
        console.error('Network Error:', error.networkError);
      }
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      throw error; // Rethrow the error to be handled in the component
    }
  };
  
  // Function to fetch messages
  export const fetchMessages = async (receiverID, senderID) => {
    try {
      const response = await client.query({
        query: LIST_MESSAGES,
        variables: { receiverID, senderID },
      });
      return response.data.getMessages;
    } catch (error) {
      console.error('ApolloError:', error);
      if (error.networkError) {
        console.error('Network Error:', error.networkError);
      }
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      throw error; // Rethrow the error to be handled in the component
    }
  };
  
  // Function to send a message
  export const SendMessage = async (content, sender, receiver) => {
    try {
      const response = await client.mutate({
        mutation: SEND_MESSAGE,
        variables: {
          content,
          sender,
          receiver,
        },
      });
      return response.data;
    } catch (error) {
      console.error('ApolloError:', error);
      if (error.networkError) {
        console.error('Network Error:', error.networkError);
      }
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      throw error; // Rethrow the error to be handled in the component
    }
  };





