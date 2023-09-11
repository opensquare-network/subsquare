import { withLoginUser } from "next-common/lib";
import TechcommMembersPage from "@subsquare/next/pages/techcomm/members";

export default TechcommMembersPage;

export const getServerSideProps = withLoginUser();
