import Privacy from "next-common/components/pages/privacy";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default Privacy;

export const getServerSideProps = serverSidePropsWithSummary;
