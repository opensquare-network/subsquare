import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Referendum() {
  return "Please visit `/fellowship/referenda/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/fellowship/referenda/${id}`,
);
