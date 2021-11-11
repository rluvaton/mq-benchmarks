import { v4 as uuidv4 } from 'uuid';
import { benchmarkRunner } from '../common/benchmark-runner';
import * as redis from 'redis';
import { RedisClient } from 'redis';

export const run = async () => {
  const topicName = uuidv4();

  let subscriber: RedisClient;

  await benchmarkRunner({
    name: 'Redis',
    setup: async () =>
      (subscriber = redis.createClient({
        host: 'localhost',
        port: 6379,
      })),
    createConsumer: async () => {
      subscriber.on('message', () => undefined);
      await subscriber.subscribe(topicName);
    },
    deleteConsumer: async () => subscriber.unsubscribe(),
    teardown: async () => subscriber.quit(),
  });
};

run();
