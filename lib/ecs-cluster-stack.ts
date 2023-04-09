import { Stack, StackProps } from 'aws-cdk-lib';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from 'constructs';
import { STAGE } from '../bin/ecs-fargate';

export interface EcsClusterProps extends StackProps {
  stage: STAGE;
  vpc: IVpc;
}

export class EcsClusterStack extends Stack {
  constructor(scope: Construct, id: string, props: EcsClusterProps) {
    super(scope, id, props);


    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: props.vpc,
      clusterName: `ecs-cluster-${props.stage}`

    });
    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
      cluster: cluster, // Required
      cpu: 512, // Default is 256
      desiredCount: 6, // Default is 1
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      memoryLimitMiB: 2048, // Default is 512
      publicLoadBalancer: true // Default is false
    });
  }
}