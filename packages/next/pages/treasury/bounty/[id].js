import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Bounty() {
  return "Please visit `/treasury/bounties/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/treasury/bounties/${id}`,
);
