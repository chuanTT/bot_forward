export const awaitAll = <T, R>(
  list: T[],
  asyncFn: (item: T, index: number) => R
) => {
  const promises: R[] = [];

  list.map((x, i) => {
    promises.push(asyncFn(x, i));
  });

  return Promise.all(promises);
};