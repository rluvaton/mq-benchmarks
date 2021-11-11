import * as AWS from 'aws-sdk';
import { benchmarkSqs } from '../common/benchmark-sqs';

export const run = async () => {
  await benchmarkSqs('ElasticMQ', {
    endpoint: new AWS.Endpoint('http://localhost:9324'),
    accessKeyId: 'na',
    secretAccessKey: 'na',
    region: 'REGION',
  });
};

run();
