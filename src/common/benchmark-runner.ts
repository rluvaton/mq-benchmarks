const runTimed = async (name, fn) => {
  console.time(name);

  await fn();

  console.timeEnd(name);
};

// On real benchmark we benchmarkSqs the same operation many times and get the average
// here we gonna benchmarkSqs once
export const benchmarkRunner = async ({
  setup = undefined,
  createTopic = undefined,
  deleteTopic = undefined,
  createExchange = undefined,
  deleteExchange = undefined,
  createQueue = undefined,
  deleteQueue = undefined,
  binding = undefined,
  createConsumer = undefined,
  createProducer = undefined,
  teardown = undefined,
} = {}) => {
  setup && (await setup());

  console.time('all');

  createTopic && (await runTimed('topic.create', createTopic));
  createExchange && (await runTimed('exchange.create', createExchange));
  createQueue && (await runTimed('queue.create', createQueue));

  binding && (await runTimed('binding', binding));

  createConsumer && (await runTimed('consumer.create', createConsumer));
  createProducer && (await runTimed('producer.create', createProducer));

  createQueue && deleteQueue && (await runTimed('queue.delete', deleteQueue));
  createExchange && deleteExchange && (await runTimed('exchange.delete', deleteExchange));
  createTopic && deleteTopic && (await runTimed('topic.delete', deleteTopic));

  console.timeEnd('all');

  teardown && (await teardown());
};
