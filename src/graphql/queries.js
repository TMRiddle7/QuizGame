import gql from 'graphql-tag';


// Define the query
export const LIST_ONLINE_PLAYERS = gql`
  query MyQuery {
    getOnlinePlayers {
      PlayerID
      Username
      onlineStatus
    }
  }
`;

export const LIST_MESSAGES = gql`
  query MyQuery($receiverID: ID!, $senderID: ID!) {
    getMessages(receiverID: $receiverID, senderID: $senderID) {
      MessageID
      Content
      Receiver
      Timestamp
      Sender
    }
  }
`;
