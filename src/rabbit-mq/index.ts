import { v4 as uuidv4 } from 'uuid';
import * as amqplib from 'amqplib';
import { benchmarkRunner } from '../common/benchmark-runner';
import { chooseRandomItemFromArray } from '../common/utils';

export const run = async () => {
  const exchangeName = uuidv4();
  const queueName = uuidv4();

  const exchangeRandomType = chooseRandomItemFromArray(['direct', 'topic', 'headers', 'fanout' /*, 'match'*/]);

  const connectionProperties = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest', // This is a demo app, no security considerations. This is the password for the local dev server
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
  };

  const connection = await amqplib.connect(connectionProperties);
  const channel = await connection.createChannel();

  await benchmarkRunner({
    name: 'RabbitMQ',
    createExchange: async () => await channel.assertExchange(exchangeName, exchangeRandomType),
    createQueue: async () => await channel.assertQueue(queueName),
    binding: async () => await channel.bindQueue(queueName, exchangeName, ''),
    createConsumer: async () => await channel.consume(queueName, () => undefined),
    deleteQueue: async () => await channel.deleteQueue(queueName),
    deleteExchange: async () => await channel.deleteExchange(exchangeName),
    teardown: async () => await connection.close(),
  });
};

run();
