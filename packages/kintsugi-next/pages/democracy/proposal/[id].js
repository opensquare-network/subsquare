import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Proposal() {
  return "Please visit `/democracy/proposals/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/democracy/proposals/${id}`,
);
