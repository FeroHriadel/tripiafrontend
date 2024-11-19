
const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand, ListUsersCommand, AdminDeleteUserCommand, AdminSetUserPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB, PutItemCommand, PutItemCommandInput, DeleteItemCommand, DeleteItemCommandInput } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const dotenv = require("dotenv");
dotenv.config();



//values
const awsRegion = process.env.TESTING_AWS_REGION || "awsRegionUNDEFINED!";
const awsAccessKey = process.env.TESTING_ACCESS_KEY || "accessKeyIdUNDEFINED!"; 
const secretAccessKey = process.env.TESTING_SECRET_ACCESS_KEY || "secretAccessKeyUNDEFINED!";
const userPoolId = process.env.TESTING_USER_POOL_ID || "userPoolIdUNDEFINED!";
const adminEmail = process.env.TESTING_ADMIN_EMAIL || "adminEmailUNDEFINED!";
const adminPassword = process.env.TESTING_ADMIN_PASSWORD || "adminPasswordUNDEFINED!";
const usersTable = process.env.TESTING_USERS_TABLE_NAME || "usersTableUNDEFINED!";



//types
interface User {
  email: string;
  nickname: string;
  nickname_lower?: string;
  profilePicture: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  type: '#USER';
  groups: string[]
}



//cognito & dynamoDB clients
const cognitoClient = new CognitoIdentityProviderClient({region: awsRegion, credentials: {accessKeyId: awsAccessKey, secretAccessKey: secretAccessKey}});
const client = new DynamoDB({region: awsRegion, credentials: { accessKeyId: awsAccessKey, secretAccessKey: secretAccessKey }});
const docClient = DynamoDBDocumentClient.from(client);



//helpers
function createUserObj(props: {email: string, nickname: string}): User {
  const { email, nickname } = props;
  return {
    email: email.toLowerCase(),
    nickname,
    nickname_lower: nickname.toLowerCase(),
    profilePicture: '',
    about: '',
    groups: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: '#USER'
  }
}

async function saveUserToDB(user: User) {
  console.log('saving user to db')
  const putParams: typeof PutItemCommandInput = {
      TableName: usersTable,
      Item: marshall(user),
  };
  console.log('Created putParams')
  const response = await docClient.send(new PutItemCommand(putParams));
  console.log('repsonse', response)
  return response;  
}

async function deleteUserFromDB(email: string) {
  const deleteParams: typeof DeleteItemCommandInput = {
    TableName: usersTable,
    Key: marshall({ email }),
  };
  const response = await docClient.send(new DeleteItemCommand(deleteParams));
  return response;
}

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
      Username: userEmail,
      UserAttributes: [
        { Name: "email", Value: userEmail },
        { Name: "email_verified", Value: "true" },
      ],
    });
    await cognitoClient.send(command);
    const userForDb = createUserObj({email: userEmail, nickname: userEmail.split('@')[0]});
    await saveUserToDB(userForDb);
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



// main functions
//@ts-ignore
async function createAdmin() {
  try {
    const exists = await userExists(adminEmail);
    if (exists) console.log('Cypress admin already exists')
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

//@ts-ignore
async function deleteAdmin() {
  try {
    const exists = await userExists(adminEmail);
    if (exists) {
      const command = new AdminDeleteUserCommand({
        UserPoolId: userPoolId,
        Username: adminEmail,
      });
      await cognitoClient.send(command);
      await deleteUserFromDB(adminEmail);
      console.log('Admin user deleted');
    }
    if (!exists) return console.log('Did not find Cypress Admin to delete')
  } catch (error) {
    console.error("Error deleting admin user:", error);
    throw error;
  }
}

module.exports = { createAdmin, deleteAdmin };