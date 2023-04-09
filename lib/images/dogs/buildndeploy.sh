#!/bin/bash
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=361941603254
AWS_URL=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker build --platform linux/amd64 -t dogs . \
| aws ecr get-login-password --region ${AWS_REGION} \
| docker login --username AWS --password-stdin $AWS_URL \
| docker tag dogs:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/dogs:latest \
| docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/dogs:latest