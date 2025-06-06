import { isNil } from "lodash-es";

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
    .filter(
      (result) =>
        result.status === "fulfilled" && isNil(result?.value?.data?.error),
    )
    .map((result) => ({
      data: result.value.data,
      index: result.value.originalIndex,
    }));
}
