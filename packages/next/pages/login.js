import { getRedirectHomeProps } from "next-common/services/serverSide";

export default function Proposal() {
  return "Please login on home page";
}

export const getServerSideProps = getRedirectHomeProps;
