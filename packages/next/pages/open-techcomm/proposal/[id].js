import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function TechCommProposal() {
  return "Please visit `/open-techcomm/proposals/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/open-techcomm/proposals/${id}`,
);
