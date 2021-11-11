const runTimed = async (name, fn) => {
  console.time(name);

  await fn();

  console.timeEnd(name);
};

// On real benchmark we run the same operation many times and get the average
// here we gonna run once
export const benchmarkRunner = async ({
  name = undefined,
  setup = undefined,
  createTopic = undefined,
  deleteTopic = undefined,
  createExchange = undefined,
  deleteExchange = undefined,
  createQueue = undefined,
  deleteQueue = undefined,
  binding = undefined,
  createConsumer = undefined,
  deleteConsumer = undefined,
  createProducer = undefined,
  teardown = undefined,
} = {}) => {
  const timePrefix = name === undefined ? '' : `${name}.`;

  setup && (await setup());

  console.time(`${timePrefix}all`);

  createTopic && (await runTimed(`${timePrefix}topic.create`, createTopic));
  createExchange && (await runTimed(`${timePrefix}exchange.create`, createExchange));
  createQueue && (await runTimed(`${timePrefix}queue.create`, createQueue));

  binding && (await runTimed(`${timePrefix}binding`, binding));

  createConsumer && (await runTimed(`${timePrefix}consumer.create`, createConsumer));
  createProducer && (await runTimed(`${timePrefix}producer.create`, createProducer));
  deleteConsumer && (await runTimed(`${timePrefix}consumer.delete`, deleteConsumer));

  createQueue && deleteQueue && (await runTimed(`${timePrefix}queue.delete`, deleteQueue));
  createExchange && deleteExchange && (await runTimed(`${timePrefix}exchange.delete`, deleteExchange));
  createTopic && deleteTopic && (await runTimed(`${timePrefix}topic.delete`, deleteTopic));

  console.timeEnd(`${timePrefix}all`);

  teardown && (await teardown());
};
