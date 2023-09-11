import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function TechCommProposal() {
  return "Please visit `/techcomm/proposals/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/techcomm/proposals/${id}`,
);
