import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Motion() {
  return "Please visit `/alliance/motions/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/alliance/motions/${id}`,
);
