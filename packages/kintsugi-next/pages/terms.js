import Terms from "next-common/components/pages/terms";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default Terms;

export const getServerSideProps = serverSidePropsWithSummary;
