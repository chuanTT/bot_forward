import * as NodeCache from "node-cache";

export const myCache = new NodeCache({
  stdTTL: 180,
  checkperiod: 240,
});

export const getCache = (key: NodeCache.Key): string => {
  return myCache.get(key);
};

export const setCache = (
  key: NodeCache.Key,
  value: unknown,
  ttl?: number | string
) => {
  return myCache.set(key, value, ttl);
};

export const removeCache = (keys: NodeCache.Key | NodeCache.Key[]) => {
  return myCache.del(keys);
};

export const setAndDelCache = (key: NodeCache.Key, value: string, isSet: boolean) => {
  if (isSet) {
    setCache(key, value);
  } else {
    removeCache(key);
  }
};
