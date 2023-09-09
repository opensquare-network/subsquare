import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Motion() {
  return "Please visit `/council/motions/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/council/motions/${id}`,
);
