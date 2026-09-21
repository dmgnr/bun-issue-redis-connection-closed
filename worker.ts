import { redis, sleep } from "bun";
// WORKAROUND B, essentially infinite retry count
// const redis = new RedisClient(undefined, {
//   maxRetries: 4294967295,
// });

for (;;) {
  try {
    console.log(" Working", await redis.incr("test"));
  } catch (e) {
    const msg = (e as any).message as string;
    console.log(" Failing", msg ?? e);
    // -- WORKAROUND A, resetting attempts count
    // if (msg.includes("Connection has failed")) {
    //   console.log(" Attempting manual reconnection");
    //   redis.connect();
    // }
  }
  await sleep(1000);
}
