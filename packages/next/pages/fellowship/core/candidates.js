import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";
import FellowshipCandidatesPage from "next-common/components/pages/fellowship/candidates";

export default FellowshipCandidatesPage;
export const getServerSideProps = getFellowshipMembersServerSideProps;
