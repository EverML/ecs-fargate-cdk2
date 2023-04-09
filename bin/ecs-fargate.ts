#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { EcsClusterStack } from '../lib/ecs-cluster-stack';
import { VPCStack } from '../lib/vpc-stack';

export enum STAGE {
  DEV = 'dev',
  QA  = 'qa',
  PRD = 'prd' 
}


const app = new cdk.App();


//BASE VPC AND NETWORKING RESOURCES
const vpcDEV = new VPCStack(app,`VPCSTACK${STAGE.DEV}`,{
  stage: STAGE.DEV,
  cidr: '10.0.0.0/16'
})

new EcsClusterStack(app, `EcsClusterStack${STAGE.DEV}`, {
  env: { account: '361941603254', region: 'us-east-1' },
  stage: STAGE.DEV,
  vpc: vpcDEV.vpc
});                 