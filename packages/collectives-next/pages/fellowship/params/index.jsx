import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function FellowshipParamsPage() {
  return "Please visit `/fellowship/core/params`";
}

export const getServerSideProps = getRedirectServerSideProps(
  () => "/fellowship/core/params",
);
