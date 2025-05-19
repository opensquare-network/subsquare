import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Proposal() {
  return "Please visit `/treasury/proposals/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/treasury/proposals/${id}`,
);
