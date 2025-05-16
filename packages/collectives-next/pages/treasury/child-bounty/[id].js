import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function ChildBounty() {
  return "Please visit `/treasury/child-bounties/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/treasury/child-bounties/${id}`,
);
