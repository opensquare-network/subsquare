import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function FellowshipCore() {
  return "Please visit `/ambassador/members`";
}

export const getServerSideProps = getRedirectServerSideProps((id) => {
  if (id === "candidates") {
    return "/ambassador/members?tab=candidates";
  }
  return "/ambassador/members/" + id;
});
