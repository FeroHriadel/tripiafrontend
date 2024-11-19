import { SecretValue } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import { BuildSpec } from "aws-cdk-lib/aws-codebuild";
import * as dotenv from 'dotenv';
dotenv.config();



type AmplifyAppProps = {
  appName: string;
  stage: string;
  branch: string;
  ghOwner: string;
  repo: string;
  ghTokenName: string;
}



export function createAmplifyApp(scope: Construct, props: AmplifyAppProps) {
  const { appName, stage, branch, ghOwner, repo, ghTokenName } = props;
  
  const amplifyApp = new amplify.App(scope, `${appName}`, {
    appName,
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: ghOwner, 
      repository: repo, 
      oauthToken: SecretValue.secretsManager(ghTokenName)
    }),
    platform: amplify.Platform.WEB_COMPUTE,
    autoBranchDeletion: true,
    customRules: [{source: '*', target: '/index.html', status: amplify.RedirectStatus.NOT_FOUND_REWRITE}],
    environmentVariables: {
      NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || 'apiUNDEFINED!',
      NEXT_PUBLIC_WS_ENDPOINT: process.env.NEXT_PUBLIC_WS_ENDPOINT || 'wsUNDEFINED!',
      NEXT_PUBLIC_USERPOOL_ID: process.env.NEXT_PUBLIC_USERPOOL_ID || 'userpoolIdUNDEFINED!',
      NEXT_PUBLIC_USERPOOL_CLIENT_ID: process.env.NEXT_PUBLIC_USERPOOL_CLIENT_ID || 'clientIdUNDEFINED!',
      NEXT_PUBLIC_IMAGES_BUCKET: process.env.NEXT_PUBLIC_IMAGES_BUCKET || 'bucketUNDEFINED!',
      NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'mapboxTokenUNDEFINED!',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'appUrlUNDEFINED!',
    },
    buildSpec: BuildSpec.fromObjectToYaml({
      version: 1,
      frontend: {
        phases: {
          preBuild: {commands: [
            'nvm install 20.12.2',
            'nvm use 20.12.2',
            'npm i' //'npm ci' doesn't work - blessed be aws amplify
          ]},
          build: {commands: [
            'npm run build'
          ]},
          preTest: { commands: [
            'npm run create-testing-data',
            'npm install -D wait-on',
            //'npx cypress install', //manually install Cypress Binary (if you are not caching them) (or tests will fail the 2nd time they run)
            'npm run start &',
            'npx wait-on http://localhost:3000 --timeout 60000'
          ]},
          test: { commands: [
            'npx cypress run'
          ]},
          postTest: { commands: [
            'npm run destroy-testing-data'
          ]},
          postBuild: {commands: [
            'echo BUILD COMPLETE...'
          ]},
        },
        artifacts: {
          baseDirectory: '.next',
          files: ['**/*']
        },
        cache: {
          paths: [
            'node_modules/**/*',
            '.next/cache/**/',
            '~/.cache/Cypress' //cache Cypress Binary (or test will fail the 2nd time they run)
          ]
        },
      }
    })
  });

  amplifyApp.addBranch(branch, {stage: 'PRODUCTION', branchName: branch});

  return amplifyApp;
}






