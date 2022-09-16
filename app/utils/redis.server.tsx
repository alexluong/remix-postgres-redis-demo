import Redis from 'ioredis';

let redis: Redis;

declare global {
  let __redis: Redis | undefined;
}

const config = process.env.REDIS_URI;

if (process.env.NODE_ENV === 'production') {
  redis = new Redis(config);
} else {
  if (!global.__redis) {
    global.__redis = new Redis(config);
  }

  redis = global.__redis;
}

export { redis };