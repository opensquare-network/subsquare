import getFellowshipFeedsServerSideProps from "next-common/services/serverSide/fellowship/feeds";
import FellowshipFeedsPage from "next-common/components/pages/fellowship/feeds";

export default FellowshipFeedsPage;

export const getServerSideProps = getFellowshipFeedsServerSideProps;
