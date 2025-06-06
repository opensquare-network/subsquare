import getAmbassadorMembersServerSideProps from "next-common/services/serverSide/ambassador/members";
import AmbassadorCoreMembersPage from "next-common/components/pages/ambassador/core";

export default AmbassadorCoreMembersPage;

export const getServerSideProps = getAmbassadorMembersServerSideProps;
