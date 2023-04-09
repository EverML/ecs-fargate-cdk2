# login on ecr

`aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com`

# tag

`docker tag dogs:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/dogs:latest`


# push

`docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cats:latest`