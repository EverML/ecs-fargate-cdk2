import { Stack, StackProps } from 'aws-cdk-lib';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import * as ecr from "aws-cdk-lib/aws-ecr";
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
      clusterName: `EcsCluster${props.stage}`

    });

    const webRepository = ecr.Repository.fromRepositoryName(this,`importedWebRepository${props.stage}`,'web')
    // const catsRepository = ecr.Repository.fromRepositoryName(this,`importedCatRepository${props.stage}`,'cats')
    // const dogsRepository = ecr.Repository.fromRepositoryName(this,`importedDogRepository${props.stage}`,'dogs')
    
    // Create a load-balanced Fargate service and make it public
    const service = this.createNewService('web',cluster, webRepository);

    //this.createNewService('cat',cluster, catsRepository);
    //this.createNewService('dog',cluster, dogsRepository);
  } 

  
  private createNewService(name:string,cluster: ecs.Cluster, repository: ecr.IRepository) {
    return new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${name}-service`, {
      serviceName:`service-${name}`,
      loadBalancerName: `alb-${name}`,
      cluster: cluster,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: { image: ecs.ContainerImage.fromEcrRepository(repository) },
      memoryLimitMiB: 512,
      publicLoadBalancer: true
    });
  }

}