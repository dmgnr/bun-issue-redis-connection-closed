import { $, sleep, spawn } from "bun";
const log = (...c: any[]) => console.log("  +", ...c);

log("Starting redis");
await $`docker compose -f redis-compose.yml up -d`;

log("Starting test script");
const proc = spawn({
  cmd: [process.argv0, "worker.ts"],
  stdout: "inherit",
  stderr: "inherit",
  env: { ...process.env, REDIS_URL: "localhost:16379" },
});
await sleep(5000);

log("Restarting redis [expected: works fine]");
await $`docker compose -f redis-compose.yml restart`;
await sleep(5000);

log("Temporarily stopping redis [expected: waits for retry then start to fail]");
await $`docker compose -f redis-compose.yml stop`;
await sleep(60000);

log("Spinning redis back up [expected: connection continues failing]");
await $`docker compose -f redis-compose.yml start`;
await sleep(10000);

log("Cleaning up");
await $`docker compose -f redis-compose.yml down`;
proc.kill();
