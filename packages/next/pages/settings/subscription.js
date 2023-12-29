import { getRedirectServerSidePropsByContext } from "next-common/services/serverSide";

export default function Notification() {
  return "Please visit `/settings/notifications`";
}

export const getServerSideProps = getRedirectServerSidePropsByContext((ctx) =>
  ctx.resolvedUrl?.replace(
    /^\/settings\/subscription/,
    "/settings/notifications",
  ),
);
