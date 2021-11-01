import * as AWS from 'aws-sdk';
import * as utils from 'util';

async function run() {
  // Create an SQS service object on the elasticmq endpoint
  const config = {
    endpoint: new AWS.Endpoint('http://localhost:9324'),
    accessKeyId: 'na',
    secretAccessKey: 'na',
    region: 'REGION',
  };

  console.time('all');

  //

  console.time('connection');
  const sqs = new AWS.SQS(config);
  console.timeEnd('connection');

  //

  const createQueuePr = utils.promisify(sqs.createQueue).bind(sqs);
  const getQueueUrlPr = utils.promisify(sqs.getQueueUrl).bind(sqs);
  const deleteQueuePr = utils.promisify(sqs.deleteQueue).bind(sqs);

  //

  console.time('create');

  const params = {
    QueueName: 'some-name',
  };
  await createQueuePr(params);
  const { QueueUrl } = await getQueueUrlPr(params);

  console.timeEnd('create');

  //

  console.time('delete');
  await deleteQueuePr({ QueueUrl });
  console.timeEnd('delete');

  //

  console.timeEnd('all');
}

run();
