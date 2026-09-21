import { redis, sleep } from "bun";

for (;;) {
  try {
    console.log(" Working", await redis.incr("test"));
  } catch (e) {
    console.log(" Failing", (e as any).message ?? e);
  }
  await sleep(1000);
}
