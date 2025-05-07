export default async function trackPromises(promises) {
  if (
    !Array.isArray(promises) ||
    !promises.every((p) => p instanceof Promise)
  ) {
    return null;
  }

  const results = await Promise.allSettled(
    promises.map((promise, originalIndex) =>
      promise.then((data) => ({ data, originalIndex })),
    ),
  );

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => ({
      data: result.value.data,
      index: result.value.originalIndex,
    }));
}
