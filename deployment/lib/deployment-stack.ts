import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createAmplifyApp } from './amplify';
import * as dotenv from 'dotenv';
dotenv.config();



/************************************************************************************

  TYPESCRIPT CLASH RESOLUTION
  if u have this app in your frontend dir (like e.g.: myFrontendApp/deployment) 
  please go to the FE tsconfig.json and put "deployment" to the "exclude" array. 
  Like this: "exclude": ["node_modules", "cdk.out", "deployment"]

  PRE-DEPLOY
  Please go to you FE directory and run `$ npm run build`
  Make sure it builds correctly
  If not, fix everything and then build again - else it won't build on amplify either

*************************************************************************************/



export class DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyProps = {
      ghOwner: process.env.GITHUB_OWNER || 'githubOwnerUNDEFINED!',
      ghTokenName: process.env.GITHUB_TOKEN_NAME || 'githubTokenUNDEFINED!',
      repo: process.env.GITHUB_REPO_NAME || 'githubRepoUNDEFINED!',
      appName: this.stackName, //change this if you need to
      stage: 'prod',
      branch: 'main' //change this if you need to
    };

    const amplifyApp = createAmplifyApp(this, amplifyProps);
  }
}
