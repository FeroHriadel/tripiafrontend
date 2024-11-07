# TRIPIA FRONTEND
- app where travellers can find travel companions, plan trips, draw in map, create groups...
- frontend for tripiabackend
<br />

## FEATURES
- nextjs
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
NEXT_PUBLIC_APP_URL = https://tripia.sk
```

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
# Deployment vars:
ACCOUNT_ID=802688607666
REGION=us-east-1
APP_NAME=devTripiaFrontend
GITHUB_OWNER=FeroHriadel
GITHUB_TOKEN_NAME=github-token
GITHUB_REPO_NAME=tripiafrontend
# NextJS vars (copy-paste from /frontend/.env)
NEXT_PUBLIC_API_ENDPOINT = https://999bphfb7b.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_WS_ENDPOINT = wss://6o234jz3yc.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_USERPOOL_ID = us-east-1_4wqKAuhEz
NEXT_PUBLIC_USERPOOL_CLIENT_ID = 7bv7qbvtf1lebf133jifuh3hku
NEXT_PUBLIC_IMAGES_BUCKET = tripia-devimages-bucket-myuniquename.s3.us-east-1.amazonaws.com
NEXT_PUBLIC_MAPBOX_TOKEN = pk.eyJ1IjoicG9zc2OcIiwiYSI6ImNtMTd3MW1lZTExYmkycXM4b3V0ZHAyY3QifQ.snfh77uiApPJNVZDW2VMqw
NEXT_PUBLIC_APP_URL = https://tripia.sk
```
- Go to go to frontend/deployment and run $ `npm i`
- Go to frontend/deployment and run $ `cdk deploy --profile ferohriadeladmin`
- Push to github to trigger Amplify build
