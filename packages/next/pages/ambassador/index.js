import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Ambassador() {
  return "Please visit `/ambassador/referenda/`";
}

export const getServerSideProps = getRedirectServerSideProps(
  () => "/fellowship/referenda",
);
