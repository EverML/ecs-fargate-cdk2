import { Stack, StackProps } from 'aws-cdk-lib';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
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
      clusterName: `EcsCluster${props.stage}`

    });

    const webRepository = ecr.Repository.fromRepositoryName(this, `importedWebRepository${props.stage}`, 'web')
    //const catsRepository = ecr.Repository.fromRepositoryName(this, `importedCatRepository${props.stage}`, 'cats')
    const dogsRepository = ecr.Repository.fromRepositoryName(this, `importedDogRepository${props.stage}`, 'dogs')

    const webTaskDefinition = new ecs.FargateTaskDefinition(this, 'WebTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256
    });

    const webContainer = webTaskDefinition.addContainer('WebContainer', {
      containerName: 'webContainer',
      image: ecs.ContainerImage.fromEcrRepository(webRepository),
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'web',
        logRetention: logs.RetentionDays.FIVE_DAYS
      }),
      portMappings: [{
        containerPort: 80
      }]
    });

    const dogsTaskDefinition = new ecs.FargateTaskDefinition(this, 'DogsTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256
    });

    const dogsService = new ecs.FargateService(this, "dogsService", {
      cluster,
      taskDefinition: dogsTaskDefinition,
      serviceName: 'dogsService'
    });

    const dogsContainer = dogsTaskDefinition.addContainer('DogsContainer', {
      containerName: 'dogsContainer',
      image: ecs.ContainerImage.fromEcrRepository(dogsRepository),
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'dogs',
        logRetention: logs.RetentionDays.FIVE_DAYS
      }),
      portMappings: [{
        containerPort: 80
      }]
    });

    const webService = new ecs.FargateService(this, "webService", {
      cluster,
      taskDefinition: webTaskDefinition,
      serviceName: 'webService'
    });

    //
    const albWeb = new elbv2.ApplicationLoadBalancer(this, 'WEBALB', {
      loadBalancerName: `ALBWeb-${props.stage}`,
      vpc: props.vpc,
      internetFacing: true
    });

    // Define target groups for each service
    const webTargetGroup = new elbv2.ApplicationTargetGroup(this, 'webTargetGroup', {
      targets: [webService],
      port: 80,
      vpc: props.vpc,
      targetGroupName: 'webTargetGroup'
    });

    const dogsTargetGroup = new elbv2.ApplicationTargetGroup(this, 'dogsTargetGroup', {
      targets: [dogsService],
      port: 80,
      vpc: props.vpc,
      targetGroupName: 'dogsTargetGroup'
    });

    // Add listener rules to route traffic to the appropriate target group
    const listenerWeb = albWeb.addListener('webListener', {
      port: 80,
      defaultAction:elbv2.ListenerAction.forward([webTargetGroup]),
    })

  }



}