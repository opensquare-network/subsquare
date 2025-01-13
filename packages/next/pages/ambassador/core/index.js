import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function FellowshipCore() {
  return "Please visit `/ambassador/members`";
}

export const getServerSideProps = getRedirectServerSideProps(
  () => "/ambassador/members",
);
