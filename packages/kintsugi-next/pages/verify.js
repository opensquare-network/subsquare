import Verify from "next-common/components/pages/verify";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default Verify;

export const getServerSideProps = serverSidePropsWithSummary;
