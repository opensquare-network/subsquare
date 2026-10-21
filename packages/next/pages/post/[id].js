import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Post() {
  return "Please visit `/posts/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/posts/${id}`,
);
