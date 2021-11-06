import { benchmarkRunner } from '../../common/benchmark-runner';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';

export const benchmarkSqs = async (sqsConfig) => {
  const sqs = new AWS.SQS(sqsConfig);

  const queueName = uuidv4();

  const params = {
    QueueName: queueName,
  };
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
