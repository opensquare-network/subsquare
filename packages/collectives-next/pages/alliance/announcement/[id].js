import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Announcement() {
  return "Please visit `/alliance/announcements/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/alliance/announcements/${id}`,
);
