import { CognitoIdentityProviderClient, InitiateAuthCommand, GlobalSignOutCommand ,SignUpCommand, AdminConfirmSignUpCommand, AliasExistsException  } from "@aws-sdk/client-cognito-identity-provider";
// import { Axios, AxiosError } from "axios";
import axios from 'axios';
const client = new CognitoIdentityProviderClient({ 
    region: "us-east-1",
    credentials: {
    accessKeyId: "AKIA4MTWKKOXSEH6FA6L",
    secretAccessKey: "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"
  } 
});

const awsWebsocket = new WebSocket('wss://ov5y8form1.execute-api.us-east-1.amazonaws.com');

export const signUp = async (username, email, password) => {
       const signUpCommand = new SignUpCommand({
         ClientId: "6f8pnna0jmdi19vimku4k9scb3",
         Username: username,
         Password: password,
         UserAttributes: [
           {
             Name: "email",
             Value: email,
           },
         ],
       });
    
       try {
         await client.send(signUpCommand);
    
         const confirmCommand = new AdminConfirmSignUpCommand({
           UserPoolId: "us-east-1_CzzSA6wYk", // Replace with your actual User Pool ID
           Username: username,
         });
         await client.send(confirmCommand);
       } catch (error) {
         throw new Error(error.message);
       }
     };


export const signIn = async (username, password) => {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "6f8pnna0jmdi19vimku4k9scb3",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  try {
    const response = await client.send(command);
    awsWebsocket.onopen= () =>{
      console.log('websocket connection open');
    }
    localStorage.setItem('playerUsername', username);
    localStorage.setItem('accessToken', response.AuthenticationResult.AccessToken);
    return response.AuthenticationResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signOut = async (accessToken) => {
  const command = new GlobalSignOutCommand({
    AccessToken: accessToken,
  });

  try {
    const response = await client.send(command);
    if(response.$metadata.httpStatusCode === 200)
      {
        const endpointUrl = 'https://dwtlg9ar8e.execute-api.us-east-1.amazonaws.com/SignOut'
        const data = {
          userName: localStorage.getItem('playerUsername')
        };
        try{
        const response = await axios.post(endpointUrl,data);
        }
        catch(AxiosError)
        {
          console.error('Error Sett8ing offline status: ' + AxiosError.message);
        }
      }
    localStorage.removeItem('playerUsername');
    localStorage.removeItem('accessToken');
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};