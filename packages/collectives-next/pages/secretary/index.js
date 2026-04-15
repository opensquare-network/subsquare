import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Secretary() {
  return "Please visit `/secretary/members/`";
}

export const getServerSideProps = getRedirectServerSideProps(
  () => "/secretary/members",
);
