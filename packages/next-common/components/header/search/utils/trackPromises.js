export default async function trackPromises(promises) {
  if (
    !Array.isArray(promises) ||
    !promises.every((p) => p instanceof Promise)
  ) {
    return null;
  }

  const completionOrder = [];
  const remainingPromises = [...promises];

  while (remainingPromises.length > 0) {
    const { data, index, isError } = await Promise.race(
      remainingPromises.map((p, i) =>
        p
          .then((res) => ({ data: res, index: i, isError: false }))
          .catch((err) => ({ data: err, index: i, isError: true })),
      ),
    );
    completionOrder.push({ data, isError });
    remainingPromises.splice(index, 1);
  }

  return completionOrder.map((item) => {
    if (!item.isError) return item;
  });
}
