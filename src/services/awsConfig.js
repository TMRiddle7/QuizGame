import { Amplify } from 'aws-amplify';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'https://murl5sdvjffqdastco4lptkyda.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-e62odg4hqvbfjjxk3tnawbbyhu'
    }
  }
});

export default Amplify;