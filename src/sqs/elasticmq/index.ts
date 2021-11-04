import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { benchmarkRunner } from '../../common/benchmark-runner';
import { chooseRandomItemFromArray } from '../../common/utils';

export const run = async () => {
  const queueName = uuidv4();

  const params = {
    QueueName: queueName,
  };

  const config = {
    endpoint: new AWS.Endpoint('http://localhost:9324'),
    accessKeyId: 'na',
    secretAccessKey: 'na',
    region: 'REGION',
  };

  const sqs = new AWS.SQS(config);

  let queueUrl;

  await benchmarkRunner({
    createQueue: async () => {
      await sqs.createQueue(params).promise();
      queueUrl = (await sqs.getQueueUrl(params).promise()).QueueUrl;
    },
    createConsumer: async () => await sqs.receiveMessage({ QueueUrl: queueUrl }, () => undefined).promise(),
    deleteQueue: async () => await sqs.deleteQueue({ QueueUrl: queueUrl }).promise(),
  });
};

run();
