import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function FellowshipCore() {
  return "Please visit `/fellowship/members`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => "/fellowship/members/" + id,
);
