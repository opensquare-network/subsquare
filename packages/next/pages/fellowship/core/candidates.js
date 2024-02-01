import FellowshipCandidatesPage from "next-common/components/pages/fellowship/candidates";
import getFellowshipParamsServerSideProps from "next-common/services/serverSide/fellowship/params";

export default FellowshipCandidatesPage;
export const getServerSideProps = getFellowshipParamsServerSideProps;
