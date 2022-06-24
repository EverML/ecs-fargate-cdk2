#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcsFargateCdk2Stack } from '../lib/ecs-fargate-cdk2-stack';

const app = new cdk.App();
new EcsFargateCdk2Stack(app, 'EcsFargateCdk2Stack', {
  env: { account: '123456789012', region: 'us-east-1' },
});                 