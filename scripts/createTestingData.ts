import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand, ListUsersCommand, AdminDeleteUserCommand, AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import * as dotenv from "dotenv";
dotenv.config();



//values
const awsRegion = process.env.TESTING_AWS_REGION || "awsRegionUNDEFINED!";
const awsAccessKey = process.env.TESTING_ACCESS_KEY || "accessKeyIdUNDEFINED!"; 
const secretAccessKey = process.env.TESTING_SECRET_ACCESS_KEY || "secretAccessKeyUNDEFINED!";
const userPoolId = process.env.TESTING_USER_POOL_ID || "userPoolIdUNDEFINED!";
const adminEmail = process.env.TESTING_ADMIN_EMAIL || "adminEmailUNDEFINED!";
const adminPassword = process.env.TESTING_ADMIN_PASSWORD || "adminPasswordUNDEFINED!";


//cognito client
const cognitoClient = new CognitoIdentityProviderClient({
    region: awsRegion,
    credentials: {accessKeyId: awsAccessKey, secretAccessKey: secretAccessKey}
});


//helpers
async function userExists(userEmail: string) {
  try {
    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `email="${userEmail}"`,
    });
    const res = await cognitoClient.send(command);
    return res.Users && res.Users.length > 0;
  } catch (error) {
    console.error("Error listing users:", error);
    throw error;
  }
}

async function createUser(userEmail: string) {
  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: adminEmail,
      UserAttributes: [
        { Name: "email", Value: userEmail },
        { Name: "email_verified", Value: "true" },
      ],
    });
    await cognitoClient.send(command);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function setPermanentPassword(userEmail: string, userPassword: string) {
  try {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: userEmail,
      Password: userPassword,
      Permanent: true,
    });
    await cognitoClient.send(command);
  } catch (error) {
    console.error("Error setting permanent password:", error);
    throw error;
  }
}

async function addToAdminGroup(userEmail: string) {
  try {
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: userEmail,
      GroupName: "admin",
    });
    await cognitoClient.send(command);
  } catch (error) {
    console.error("Error adding user to group:", error);
    throw error;
  }
}


// user functions
export async function createAdmin() {
  try {
    const exists = await userExists(adminEmail);
    if (!exists) {
      await createUser(adminEmail);
      await setPermanentPassword(adminEmail, adminPassword);
      await addToAdminGroup(adminEmail);
      console.log('Admin user created');
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

export async function deleteAdmin() {
  try {
    const exists = await userExists(adminEmail);
    if (exists) {
      const command = new AdminDeleteUserCommand({
        UserPoolId: userPoolId,
        Username: adminEmail,
      });
      await cognitoClient.send(command);
      console.log('Admin user deleted');
    }
  } catch (error) {
    console.error("Error deleting admin user:", error);
    throw error;
  }
}