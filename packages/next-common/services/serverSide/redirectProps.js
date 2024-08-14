import { noop } from "lodash-es";

export function getRedirectServerSideProps(getDestinationFun = noop) {
  return getRedirectServerSidePropsByContext((ctx) =>
    getDestinationFun(ctx.query.id),
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
