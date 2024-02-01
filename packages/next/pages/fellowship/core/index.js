import FellowshipMembersPage from "next-common/components/pages/fellowship/members";
import getFellowshipParamsServerSideProps from "next-common/services/serverSide/fellowship/params";

export default FellowshipMembersPage;

export const getServerSideProps = getFellowshipParamsServerSideProps;
