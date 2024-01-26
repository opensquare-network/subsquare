import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";
import FellowshipMembersPage from "next-common/components/pages/fellowship/members";

export default FellowshipMembersPage;
export const getServerSideProps = getFellowshipMembersServerSideProps;
