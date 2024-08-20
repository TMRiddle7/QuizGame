import { gql } from "graphql-request";

export const ON_MESSAGE_RECEIVED = gql`
  subscription OnMessageReceived($receiverID: ID!) {
    onMessageReceived(receiverID: $receiverID) {
      MessageID
      Sender
      Content
      Timestamp
    }
  }
`;