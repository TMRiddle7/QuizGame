
import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation sendMessage($content: String!, $sender: ID!, $receiver: ID!) {
    sendMessage(content: $content, senderID: $sender, receiverID: $receiver) {
    Content
    MessageID
    Receiver
    Sender
    Timestamp
  }
  }
`;


