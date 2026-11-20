import { noop } from "lodash-es";
import isMalformedRouteParam from "next-common/utils/isMalformedRouteParam";

export function getRedirectServerSideProps(getDestinationFun = noop) {
  const redirectProps = getRedirectServerSidePropsByContext((ctx) =>
    // The id is the decoded route segment, and every caller drops it into the redirect's path.
    // Handing it over encoded keeps the Location header ASCII: a URL with non-ASCII in it — a
    // link someone pasted with Chinese text glued onto the path — otherwise made setHeader throw
    // and the page answered 500 instead of redirecting.
    getDestinationFun(encodeURIComponent(ctx.query.id)),
  );

  return async function (ctx) {
    // Redirecting to a destination built from a malformed id only echoes scanner payloads
    // back in the Location header, so serve those requests as a missing page.
    if (isMalformedRouteParam(ctx.query.id)) {
      return { notFound: true };
    }

    return redirectProps(ctx);
  };
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
