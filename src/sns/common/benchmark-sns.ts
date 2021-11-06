import { benchmarkRunner } from '../../common/benchmark-runner';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';

export const benchmarkSns = async (snsConfig) => {
  const sns = new AWS.SNS(snsConfig);

  const topicName = uuidv4();

  const params = {
    Name: topicName,
  };
  let topicArn;
  let subscriptionArn;

  await benchmarkRunner({
    createTopic: async () => {
      topicArn = (await sns.createTopic(params).promise()).TopicArn;
    },
    createConsumer: async () => {
      subscriptionArn = (
        await sns
          .subscribe({ TopicArn: topicArn, Protocol: 'application', Endpoint: 'MOBILE_ENDPOINT_ARN' }, () => undefined)
          .promise()
      ).SubscriptionArn;
    },
    deleteConsumer: async () => await sns.unsubscribe({ SubscriptionArn: subscriptionArn }, () => undefined).promise(),
    deleteTopic: async () =>
      await sns
        .deleteTopic({
          TopicArn: topicArn,
        })
        .promise(),
  });
};
