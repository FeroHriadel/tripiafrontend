# TRIPIA FRONTEND
- app where travellers can find travel companions, plan trips, draw in map, create groups...
- frontend for tripiabackend
<br />


## FEATURES
- nextjs
- aws amplify auth
- amplify deployment
- aws serverless backend
<br />


## SOFTWARE VERSIONS
- node 20.12.2
- nextjs 14.2.5
<br />


## SETUP
- first deploy the backend: https://github.com/FeroHriadel/tripiabackend.git
- once BE deployment is over it should print api, userpool_id, client_id... in the terminal
- bucket url must be found in the aws console. Only copy the part of bucket url without https:// (just: cdk-handbook-images-bucket-05prt4i.s3.us-east-1.amazonaws.com)
- create /.env
- put there:

```
NEXT_PUBLIC_API_ENDPOINT = https://999bphfb7b.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_WS_ENDPOINT = wss://6o234jz3yc.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_USERPOOL_ID = us-east-1_4wqKAuhEz
NEXT_PUBLIC_USERPOOL_CLIENT_ID = 7bv7qbvtf1lebf133jifuh3hku
NEXT_PUBLIC_IMAGES_BUCKET = tripia-devimages-bucket-myuniquename.s3.us-east-1.amazonaws.com
NEXT_PUBLIC_MAPBOX_TOKEN = pk.eyJ1IjoicG9zc2OcIiwiYSI6ImNtMTd3MW1lZTExYmkycXM4b3V0ZHAyY3QifQ.snfh77uiApPJNVZDW2VMqw
NEXT_PUBLIC_APP_URL = https://tripiask.com
```
<br />


### DEPLOYMENT
- It is assumed that there will be no stages but multiple deployments instead. Each developer can have their own deployment to play with.
- The `/deployment` folder contains aws cdk code to deploy the frontend app on AWS Amplify. It is currently set up to deploy the code from the `main` branch under the app name: `devTripiaFrontend`. Please change these 2 if you need to have a deployment from another branch: `/deployment/lib/deployment-stack.ts` has detailed instructions on how to do that.
<br />
- Create a github token in github - like this:
<br />
<small>
  go to your Github / click ur profile picture (right up) / Settings
  (left sidebar) Developer Settings / Personal Access Tokens / Tokens (classic)
  Generate new token / choose classic / Select scopes: repo & admin:repo_hook / name it e.g.: `github-token` / Generate token
  Copy the value of the token (something like: `ghp_66PWc461Drgh0nvEFiiKnsabzPJtZf2583Wq`)
</small>
- Put the github token in AWS / SECRETS MANAGER under the name `github-token` like this:
<br />
<small>
  copy the value of the github-token and go to AWS / SECRETS MANAGER / Store a new secret / Other type of secret / Next
  in Key/value pair section click Plaintext tab and paste the github-token there / Next / Secret name: github-token / Next / complete the procedure…
</small>
- go to frontend folder and run $ `npm run build`. See if it builds properly. Fix if not.
- go to frontend/tsconfig.json and add "deployment" to the "exclude" array (if not already there)
```
"exclude": ["node_modules", "cdk.out", "deployment"]
```
- Go to frontend/deployment and create a new file: .env.
- Fill it out with values that are true for you:
```
#Deployment vars:
ACCOUNT_ID=802688607666
REGION=us-east-1
APP_NAME=devTripiaFrontend
GITHUB_OWNER=FeroHriadel
GITHUB_TOKEN_NAME=github-token
GITHUB_REPO_NAME=tripiafrontend

#NextJS vars (copy-paste from /frontend/.env)
NEXT_PUBLIC_API_ENDPOINT = https://999bphfb7b.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_WS_ENDPOINT = wss://6o234jz3yc.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_USERPOOL_ID = us-east-1_4wqKAuhEz
NEXT_PUBLIC_USERPOOL_CLIENT_ID = 7bv7qbvtf1lebf133jifuh3hku
NEXT_PUBLIC_IMAGES_BUCKET = tripia-devimages-bucket-myuniquename.s3.us-east-1.amazonaws.com
NEXT_PUBLIC_MAPBOX_TOKEN = pk.eyJ1IjoicG9zc2OcIiwiYSI6ImNtMTd3MW1lZTExYmkycXM4b3V0ZHAyY3QifQ.snfh77uiApPJNVZDW2VMqw
NEXT_PUBLIC_APP_URL = https://tripia.sk

#Testing vars
TESTING_AWS_REGION = us-east-1
TESTING_ACCESS_KEY = AKIAW99f9BMtuoCSDY75P
TESTING_SECRET_ACCESS_KEY = 98f0fAoOoO0O16j6HaGfFBO7GYbdOOt+kwPdmMP3
TESTING_USER_POOL_ID = us-east-1_9oKOAwjIj
TESTING_BUCKET_NAME = tripia-devimages-bucket-myuniquename
TESTING_USERS_TABLE_NAME=tripia-devUsersTable
TESTING_TRIPS_TABLE_NAME=tripia-devTripsTable
TESTING_POSTS_TABLE_NAME=tripia-devPostsTable
TESTING_INVITATIONS_TABLE_NAME=tripia-devInvitationsTable
TESTING_GROUPS_TABLE_NAME=tripia-devGroupsTable
TESTING_FAVORITE_TRIPS_TABLE_NAME=tripia-devFavoriteTripsTable
TESTING_COMMENTS_TABLE_NAME=tripia-devCommentsTable
TESTING_CATEGORIES_TABLE_NAME=tripia-devCategoriesTable
TESTING_ADMIN_EMAIL = cypress.admin@email.com
TESTING_ADMIN_PASSWORD = 123456
```
- Go to go to frontend/deployment and run $ `npm i`
- Go to frontend/deployment and run $ `cdk deploy --profile yourawsprofile`
- Push to github to trigger Amplify build
<br />


### TESTING
- Cypress E2E tests. Run locally: $ `npx cypress open`
- Cypress env. vars can be set in `/cypress.config.json` like so:
```
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    env: {
      APP_URL: 'http://localhost:3000',
    },
    setupNodeEvents(on, config) {
 
    },
  },
});
```
- test scenarios are in `/cypress/e2e`
- custom cypress commands are in `/cypress/support/commands.ts` a new command (if you add one) also needs to be added to types in `/cypress/support/index.d.ts`
- AWS IAM user needs to be created in AWS Console with the following privileges:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminAddUserToGroup",
                "cognito-idp:ListUsers",
                "cognito-idp:AdminDeleteUser",
                "cognito-idp:AdminSetUserPassword"
            ],
            "Resource": "arn:aws:cognito-idp:us-east-1:472693607173:userpool/us-east-1_5mnKAuhEz"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::tripia-devimages-bucket-ioioioi/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devUsersTable", //or whatever the table names are...
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devTripsTable",
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devPostsTable",
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devInvitationsTable",
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devGroupsTable",
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devFavoriteTripsTable",
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devCommentsTable",
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devCommentsTable",
                "arn:aws:dynamodb:<YOUR_REGION>:<YOUR_ACCOUNT_ID>:table/tripia-devCategoriesTable"
            ]
        }
    ]
}
```
- the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY credentials need to be copied for later use into .env
- tables names also need to be copied into .env
- We need this in .env so preTest script can populate data and postTest script can remove testing data
- add to `/.env` like this:
```
TESTING_AWS_REGION = us-east-1
TESTING_ACCESS_KEY = AKIAW99f9BMtuoCSDY75P
TESTING_SECRET_ACCESS_KEY = 98f0fAoOoO0O16j6HaGfFBO7GYbdOOt+kwPdmMP3
TESTING_USER_POOL_ID = us-east-1_9oOKAujJj
TESTING_BUCKET_NAME = tripia-devimages-bucket-myuniquename
TESTING_USERS_TABLE_NAME=tripia-devUsersTable
TESTING_TRIPS_TABLE_NAME=tripia-devTripsTable
TESTING_POSTS_TABLE_NAME=tripia-devPostsTable
TESTING_INVITATIONS_TABLE_NAME=tripia-devInvitationsTable
TESTING_GROUPS_TABLE_NAME=tripia-devGroupsTable
TESTING_FAVORITE_TRIPS_TABLE_NAME=tripia-devFavoriteTripsTable
TESTING_COMMENTS_TABLE_NAME=tripia-devCommentsTable
TESTING_CATEGORIES_TABLE_NAME=tripia-devCategoriesTable
TESTING_ADMIN_EMAIL = cypress.admin@email.com
TESTING_ADMIN_PASSWORD = 123456
```
- also remember to copy-paste `/.env` into `/deployment/.env`
- scripts/createTestingData.ts needs to be run before testing
- scripts/destroyTestingData.ts removes all testing data - I recommend running this after testing is done
- testing is set up to run on Amplify deploy as well. You'll need to add copy-paste `/.env` into `./deployment/.env`. It's so that env vars can be set up on Amplify!

<br />