import TechcommMembersPage from "@subsquare/next/pages/techcomm/members";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default TechcommMembersPage;

export const getServerSideProps = serverSidePropsWithSummary;
