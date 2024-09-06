//https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/
// https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/enable-sign-up/
// https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/manage-user-session/



import { Amplify } from "aws-amplify";
import { signUp, confirmSignUp, signIn, signOut, fetchAuthSession, resetPassword, type ResetPasswordOutput, confirmResetPassword } from "aws-amplify/auth";




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

export const cognitoSignout = async () => {
  try {
    await signOut();
    return {error: ''};
  } catch (error) {
    console.log(error);
    let er = JSON.parse(JSON.stringify(error)).name || 'Sign out failed';
    return {error: er};
  }
}

export const getCognitoSession = async () => {
  try {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {}
    if (!idToken) throw new Error('No session');
    return {accessToken, idToken, err: ''};
  } catch (error) {
    console.log(error);
    return {error: 'Getting session failed'};
  }
}

export const refreshCognitoSession = async () => {
  try {
    const { tokens } = await fetchAuthSession({forceRefresh: true});
    return {tokens, error: ''};
  } catch (error) {
    console.log(error);
    return {error: 'Refreshing session failed'};
  }
}

export const cognitoResetPassword = async(email: string) => {
  try {
    const output = await resetPassword({ username: email });
    return {output, error: ''};
  } catch (error) {
    console.log(error);
    return {error: 'Resetting password failed'};
  }
}

export const cognitoConfirmResetPassword = async (props: {email: string, confirmationCode: string, newPassword: string}) => {
  try {
    const { email, confirmationCode, newPassword } = props;
    await confirmResetPassword({ username: email, confirmationCode: confirmationCode, newPassword: newPassword});
    return {ok: true, error: ''}
  } catch (error) {
    console.log(error);
    return {error: 'Resetting password failed'};
  }
}

export const getUserFromSession = (session: any) => {
  const email = session.idToken?.payload?.email;
  const groups = session.idToken?.payload['cognito:groups'];
  const isAdmin = Array.isArray(groups) ? groups.includes('admin') : false; 
  const expires = session.idToken?.payload.exp;
  const idToken = session.idToken?.toString();
  return {email, isAdmin, expires, idToken};
}

export   const getUserFromRefreshedSession = (refreshedSession: any) => { //bc why would aws ever send some data consistently or conveniently...
  const email = refreshedSession.tokens?.idToken?.payload?.email;
  const groups = refreshedSession.tokens?.idToken?.payload['cognito:groups'];
  const isAdmin = Array.isArray(groups) ? groups.includes('admin') : false;
  const expires = refreshedSession.tokens?.idToken?.payload.exp;
  const idToken = refreshedSession.tokens?.idToken?.toString();
  return {email, isAdmin, expires, idToken};
}

export const getIdToken = async () => {
  const session = await getCognitoSession(); if (session.error) return '';
  const { idToken } = session;
  const idTokenString = idToken?.toString();
  return idTokenString || '';
}