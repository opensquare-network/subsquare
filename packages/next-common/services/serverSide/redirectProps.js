import { emptyFunction } from "next-common/utils";

export function getRedirectServerSideProps(getDestinationFun = emptyFunction) {
  return getRedirectServerSidePropsByContext((ctx) =>
    getDestinationFun(ctx.query.id),
  );
}

export function getRedirectServerSidePropsByContext(
  getDestinationFun = emptyFunction,
) {
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
