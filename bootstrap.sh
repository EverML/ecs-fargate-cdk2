# Domain Account
export CDK_NEW_BOOTSTRAP=1
npx cdk bootstrap --bootstrap-customer-key \
    --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess' \
    aws://361941603254/us-east-1
