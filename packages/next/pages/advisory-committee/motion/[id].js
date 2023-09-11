import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Motion() {
  return "Please visit `/advisory-committee/motions/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/advisory-committee/motions/${id}`,
);
