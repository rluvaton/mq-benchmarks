// This script is needed to find the Computer IP so we can assign it to kafka
// See more why here - https://github.com/wurstmeister/kafka-docker/wiki/Connectivity

import { networkInterfaces } from 'os';
import { Resolver } from 'dns';
import { promisify } from 'util';
import { writeFileSync } from 'fs';
import * as allSettled from 'promise.allsettled';
import * as path from 'path';

allSettled.shim();

const allIps = Object.entries(networkInterfaces()).map(([name, ips]) => [
  name,
  ips.map(({ family, address }) => (family === 'IPv4' ? address : undefined)).filter(Boolean)[0],
]);

async function getLocalComputerIp() {
  // Get all IPv4 addresses

  const promisesWithValidIp: Promise<{ name: string; ip: string }>[] = allIps.map(([name, ip]) => {
    const resolver = new Resolver();
    resolver.setLocalAddress(ip);

    // Google DNS
    resolver.setServers(['8.8.8.8']);

    // Check if can reach Google - meaning can be used as host IP
    return promisify(resolver.resolve4)
      .call(resolver, 'google.com')
      .then(() => ({ name, ip }));
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Ignoring allSettled not exist as we use a polyfill
  const results = await Promise.allSettled(promisesWithValidIp);

  const workingIp = results.find(({ status }) => status === 'fulfilled');

  return workingIp.value;
}

function writeEnvFile(path, ip) {
  writeFileSync(path, `HOST_IP=${ip}`);
}

async function run() {
  const { name, ip } = (await getLocalComputerIp()) || {};

  if (!ip) {
    console.error('No IP on this computer was able to connect to Google');
    process.exit(1);
  }

  console.log(`For Kafka: Found Computer IP at ${ip} For ${name}`);

  writeEnvFile(path.join(__dirname, '.env'), ip);
}

run();
