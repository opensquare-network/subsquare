export default async function trackPromises(promises) {
  if (
    !Array.isArray(promises) ||
    !promises.every((p) => p instanceof Promise)
  ) {
    return null;
  }

  const completionOrder = [];
  const indexedPromises = promises.map((p, originalIndex) => ({
    promise: p,
    originalIndex,
  }));

  while (indexedPromises.length > 0) {
    const result = await Promise.race(
      indexedPromises.map(({ promise, originalIndex }) =>
        promise
          .then((res) => ({ data: res, originalIndex, status: "fulfilled" }))
          .catch((err) => ({ error: err, originalIndex, status: "rejected" })),
      ),
    );

    completionOrder.push(result);

    const foundIndex = indexedPromises.findIndex(
      (item) => item.originalIndex === result.originalIndex,
    );
    if (foundIndex !== -1) {
      indexedPromises.splice(foundIndex, 1);
    }
  }

  return completionOrder
    .filter((item) => item.status === "fulfilled")
    .map(({ data, originalIndex }) => ({
      data,
      index: originalIndex,
    }));
}
