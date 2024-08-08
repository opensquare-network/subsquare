export function addRouterQuery(router, name, value) {
  router.replace(
    {
      pathname: router.pathname,
      query: { ...router.query, [name]: value },
    },
    undefined,
    { shallow: true },
  );
}

export function removeRouterQuery(router, query) {
  const newQuery = { ...router.query };
  delete newQuery[query];
  router.replace(
    {
      pathname: router.pathname,
      query: newQuery,
    },
    undefined,
    {
      shallow: true,
    },
  );
}

export function getRouterQuery(router, query) {
  return router.query[query];
}
