import * as amqplib from 'amqplib';

async function run() {
  const connectionProperties = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'rabbitmq',
    password: 'rabbitmq', // This is a demo app, no security considerations. This is the password for the local dev server
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
  };
  console.time('all');
  console.time('connection');
  const connection = await amqplib.connect(connectionProperties);
  const channel = await connection.createChannel();
  console.timeEnd('connection');

  console.time('create');
  // No name will generate a unique queue name for you
  const { queue } = await channel.assertQueue(undefined);
  console.timeEnd('create');

  console.time('delete');
  await channel.deleteQueue(queue);
  console.timeEnd('delete');
  console.timeEnd('all');
}

run();
