import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Create() {
  return "Please visit `/posts/create`";
}

export const getServerSideProps = getRedirectServerSideProps(
  () => "/posts/create",
);
