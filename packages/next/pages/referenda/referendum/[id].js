import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Referendum() {
  return "Please visit `/referenda/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/referenda/${id}`,
);
