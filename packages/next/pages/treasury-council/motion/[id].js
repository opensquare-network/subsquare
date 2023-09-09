import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Motion() {
  return "Please visit `/treasury-council/motions/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/treasury-council/motions/${id}`,
);
