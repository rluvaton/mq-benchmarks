import { v4 as uuidv4 } from 'uuid';
import { benchmarkRunner } from '../common/benchmark-runner';
import { Kafka } from 'kafkajs';
import { config } from 'dotenv';
import * as path from 'path';

// Get the same HOST_IP as Kafka have.
// The file is filled by the `set-current-ip-in-env.ts` script.
config({ path: path.join(__dirname, '.env') });

export const run = async () => {
  let kafka: Kafka;
  const topicName = uuidv4();

  await benchmarkRunner({
    setup: async () =>
      (kafka = new Kafka({
        clientId: 'my-app',
        brokers: [`${process.env.HOST_IP}:9092`],
      })),
    createConsumer: async () => {
      const consumer = kafka.consumer({ groupId: 'test-group' });

      await consumer.connect();
      await consumer.subscribe({ topic: topicName, fromBeginning: true });
    },
    createProducer: async () => {
      const producer = kafka.producer();

      await producer.connect();
    },
    // teardown: async () => await producer.disconnect(),
  });
};

run();
