import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from 'constructs';
import { STAGE } from '../bin/ecs-fargate';

export interface VPCProps extends StackProps {
  stage: STAGE;
  cidr:string;
}


export class VPCStack extends Stack {

  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: VPCProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, `VPC${props.stage}`, {
      vpcName: `VPC${props.stage}`, 
      ipAddresses: ec2.IpAddresses.cidr(props.cidr),
      maxAzs: 2,
      subnetConfiguration:[
        {
          cidrMask: 24,
          name: `public-subnet-${props.stage}`,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: `private-subnet-${props.stage}`,
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
      natGateways: 1,
    });

   
  }
}