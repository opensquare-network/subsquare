import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Track() {
  return "Please visit `/fellowship/tracks/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/fellowship/tracks/${id}`,
);
