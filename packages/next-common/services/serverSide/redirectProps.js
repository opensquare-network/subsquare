import { noop } from "lodash-es";

export function getRedirectServerSideProps(getDestinationFun = noop) {
  return getRedirectServerSidePropsByContext((ctx) =>
    // The id is the decoded route segment, and every caller drops it into the redirect's path.
    // Handing it over encoded keeps the Location header ASCII: a URL with non-ASCII in it — a
    // link someone pasted with Chinese text glued onto the path — otherwise made setHeader throw
    // and the page answered 500 instead of redirecting.
    getDestinationFun(encodeURIComponent(ctx.query.id)),
  );
}

export function getRedirectServerSidePropsByContext(getDestinationFun = noop) {
  return async function (ctx) {
    return {
      redirect: {
        permanent: true,
        destination: getDestinationFun(ctx),
      },
    };
  };
}

export function getRedirectHomeProps() {
  return {
    redirect: {
      permanent: true,
      destination: "/",
    },
  };
}
