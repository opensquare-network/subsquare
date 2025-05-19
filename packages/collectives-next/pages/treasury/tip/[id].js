import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Tip() {
  return "Please visit `/treasury/tips/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/treasury/tips/${id}`,
);
