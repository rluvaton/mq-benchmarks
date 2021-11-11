import * as AWS from 'aws-sdk';
import { benchmarkSqs } from '../common/benchmark-sqs';

export const run = async () => {
  await benchmarkSqs('LocalStack', {
    endpoint: new AWS.Endpoint('http://localhost:4566'),
    accessKeyId: 'na',
    secretAccessKey: 'na',
    region: 'ap-southeast-1',
  });
};

run();
