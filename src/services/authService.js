import { CognitoIdentityProviderClient, InitiateAuthCommand, GlobalSignOutCommand ,SignUpCommand, AdminConfirmSignUpCommand, AliasExistsException,AdminDeleteUserCommand  } from "@aws-sdk/client-cognito-identity-provider";
// import { Axios, AxiosError } from "axios";
import axios from 'axios';

 
const client = new CognitoIdentityProviderClient({ 
    region: "us-east-1",
    credentials: {
    accessKeyId: process.env.VUE_APP_ACCESS_KEY || '',
    secretAccessKey: process.env.VUE_APP_SECRET_ACCESS_KEY || '',
  } 
});

export const setCredentialsExpiry = () => {
  const now = new Date();
  // cerds set to expire in 4 hours after login.
  localStorage.setItem("CredsExpireAt",toString(now.getTime() + 14400000));
}

export const checkCredentialsExpiry = () => {
  const now = new Date();
  const expiry = localStorage.getItem("CredsExpireAt")
  if (now.getTime() > expiry) {
    // If the item has expired, remove it from localStorage and return null
    localStorage.removeItem('playerUsername');
    localStorage.removeItem('accessToken');
    return true;
  }
  else{
    return false;
  }
}

export const signUp = async (username, email, password) => {
  const clientId = "6f8pnna0jmdi19vimku4k9scb3";
  const userPoolId = "us-east-1_CzzSA6wYk"; // Replace with your actual User Pool ID

  // Create Sign Up Command
  const signUpCommand = new SignUpCommand({
    ClientId: clientId,
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
    // Step 1: Sign Up
    const signUpResponse = await client.send(signUpCommand);
    //console.log("Sign Up Response:", signUpResponse);

    // Step 2: Confirm Sign Up
    const confirmCommand = new AdminConfirmSignUpCommand({
      UserPoolId: userPoolId,
      Username: username,
    });

    const confirmResponse = await client.send(confirmCommand);
    // console.log("Confirm Response:", confirmResponse);

    // Proceed only if confirmation was successful
    if (confirmResponse.$metadata.httpStatusCode === 200) {
      const endpointUrl = 'https://dwtlg9ar8e.execute-api.us-east-1.amazonaws.com/signUp';
      const data = {
        userName: username,
        Email: email 
      };

      try {
        const response = await axios.post(endpointUrl, data);
        console.log(response.data.messsage);
        return { status: 'success', message: 'Sign Up successful!' };
      } catch (axiosError) {
        console.error('Error setting offline status:', axiosError.message);

        // Rollback: Delete user if setting offline status fails
        try {
          const deleteUserCommand = new AdminDeleteUserCommand({
            UserPoolId: userPoolId,
            Username: username,
          });
          await client.send(deleteUserCommand);
          console.log('User deleted due to failed HTTP request.');
          return { status: 'fail', message: 'Sign Up succeeded but failed to set offline status. User deleted.' };
        } catch (deleteError) {
          console.error('Error during rollback (user deletion):', deleteError.message);
          return { status: 'fail', message: 'Sign Up succeeded but failed to set offline status. User deletion failed.' };
        }
      }
    } else {
      return { status: 'fail', message: 'Sign Up confirmation failed.' };
    }

  } catch (error) {
    console.error("Error during sign-up or confirmation:", error);

    // Rollback: Delete user if sign-up or confirmation fails
    if (error.name === 'AdminConfirmSignUpException' || error.name === 'SignUpException') {
      try {
        const deleteUserCommand = new AdminDeleteUserCommand({
          UserPoolId: userPoolId,
          Username: username,
        });
        await client.send(deleteUserCommand);
        console.log('User deleted due to failed sign-up or confirmation.');
        return { status: 'fail', message: 'Sign Up failed and user deleted.' };
      } catch (deleteError) {
        console.error('Error during rollback (user deletion):', deleteError.message);
        return { status: 'fail', message: 'Sign Up failed and user deletion also failed.' };
      }
    }

    return { status: 'fail', message: `Sign Up/Confirm Error: ${error.message}` };
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
    setCredentialsExpiry();
    localStorage.setItem('playerUsername', username);
    localStorage.setItem('accessToken', response.AuthenticationResult.AccessToken);

    return { success: true, response: response };
  } catch (error) {
    let errorMessage = 'An error occurred during sign-in.';

    // Check for specific error codes
    if (error.name === 'NotAuthorizedException') {
      errorMessage = 'Incorrect username or password.';
    } else if (error.name === 'UserNotFoundException') {
      errorMessage = 'User does not exist.';
    } else if (error.name === 'UserNotConfirmedException') {
      errorMessage = 'User is not confirmed.';
    } else if (error.name === 'PasswordResetRequiredException') {
      errorMessage = 'Password reset is required.';
    } else if (error.name === 'TooManyRequestsException') {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.name === 'InvalidParameterException') {
      errorMessage = 'Invalid parameters provided.';
    }
    console.error(errorMessage);
    return { success: false, error: errorMessage };
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