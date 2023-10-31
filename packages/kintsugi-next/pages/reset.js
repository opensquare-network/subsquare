import Reset from "next-common/components/pages/reset";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default Reset;

export const getServerSideProps = serverSidePropsWithSummary;
