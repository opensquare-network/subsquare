import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Votes() {
  return "Please visit `/account/votes`";
}

export const getServerSideProps = getRedirectServerSideProps(
  () => "/account/votes",
);
