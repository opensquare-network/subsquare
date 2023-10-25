import { getRedirectServerSidePropsByContext } from "next-common/services/serverSide";

export default function Post() {
  return "Please visit `/settings/[id]`";
}

export const getServerSideProps = getRedirectServerSidePropsByContext((ctx) =>
  ctx.resolvedUrl?.replace(/^\/setting\//, "/settings/"),
);
