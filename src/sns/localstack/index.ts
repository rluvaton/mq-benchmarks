import * as AWS from 'aws-sdk';
import { benchmarkSns } from '../common/benchmark-sns';

export const run = async () => {
  await benchmarkSns('LocalStack', {
    endpoint: new AWS.Endpoint('http://localhost:4566'),
    accessKeyId: 'na',
    secretAccessKey: 'na',
    region: 'ap-southeast-1',
  });
};

run();
