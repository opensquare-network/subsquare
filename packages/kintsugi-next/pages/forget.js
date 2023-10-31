import Forget from "next-common/components/pages/forget";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default Forget;

export const getServerSideProps = serverSidePropsWithSummary;
