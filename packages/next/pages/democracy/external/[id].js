import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function External() {
  return "Please visit `/democracy/externals/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/democracy/externals/${id}`,
);
