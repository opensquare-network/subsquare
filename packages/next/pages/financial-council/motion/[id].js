import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Motion() {
  return "Please visit `/financial-council/motions/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/financial-council/motions/${id}`,
);
