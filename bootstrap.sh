# Domain Account
export CDK_NEW_BOOTSTRAP=1
npx cdk bootstrap --bootstrap-customer-key \
    --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess' \
    aws://123456789012/us-east-1 \
    --profile my_aws_profile # this should point to your aws profile name in your ~/.aws folder
