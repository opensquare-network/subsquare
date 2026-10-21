import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Track() {
  return "Please visit `/referenda/tracks/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/referenda/tracks/${id}`,
);
