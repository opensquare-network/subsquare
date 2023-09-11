import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Referendum() {
  return "Please visit `/democracy/referenda/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/democracy/referenda/${id}`,
);
