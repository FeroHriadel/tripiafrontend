//https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/
// https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/enable-sign-up/
// https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/manage-user-session/



import { Amplify } from "aws-amplify";
import { signUp, confirmSignUp, signIn, signOut, fetchAuthSession, resetPassword, type ResetPasswordOutput, confirmResetPassword } from "aws-amplify/auth";
import { error } from "console";



const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: process.env.NEXT_PUBLIC_USERPOOL_CLIENT_ID!,
      userPoolId: process.env.NEXT_PUBLIC_USERPOOL_ID!
    }
  }
};

Amplify.configure(amplifyConfig);



export const cognitoSignup = async (email: string, password: string) => {
  try {
    const res = await signUp({username: email, password});
    if (!res) throw new Error('No response from Cognito');
    const { isSignUpComplete, userId, nextStep } = res;
    return {error: ''}
  } catch (error) {
    console.log(error);
    return {error: 'Signup failed'};
  }
}

export const confirmCognitoSignup = async (email: string, confirmationCode: string) => {
  try {
    const res = await confirmSignUp({username: email, confirmationCode});
    if (!res) throw new Error('No response from Cognito');
    const { isSignUpComplete, nextStep } = res;
    return {error: ''};
  } catch (error) {
    console.log(error);
    return {error: 'Sign up confirmation failed'};
  }
}

export const cognitoSignin = async (username: string, password: string) => {
  try {
    const { isSignedIn, nextStep } = await signIn({username, password});
    return {error: ''}
  } catch (error) {
    console.log(error);
    return {error: 'Sign in failed'};
  }
}