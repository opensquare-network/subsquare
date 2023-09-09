import { emptyFunction } from "next-common/utils";

export function getRedirectServerSideProps(getDestinationFun = emptyFunction) {
  return async function (ctx) {
    return {
      redirect: {
        permanent: true,
        destination: getDestinationFun(ctx.query.id),
      },
    };
  };
}
