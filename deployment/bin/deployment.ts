#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DeploymentStack } from '../lib/deployment-stack';
import * as dotenv from 'dotenv';
dotenv.config();



const app = new cdk.App();
new DeploymentStack(app, `${process.env.APP_NAME}TripiaDeploymentStack`, {
  env: {account: process.env.ACCOUNT_ID, region: process.env.REGION},
  stackName: process.env.APP_NAME
});