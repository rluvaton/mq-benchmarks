#!/bin/bash

echo "RabbitMQ:"
echo "---------"
npm run start:rabbitmq

echo "SQS (ElasticMQ):"
echo "---------"
npm run start:sqs:elasticmq

echo "SQS (LocalStack):"
echo "---------"
npm run start:sqs:localstack

echo "SNS (LocalStack):"
echo "---------"
npm run start:sns:localstack

echo "Redis:"
echo "---------"
npm run start:redis

