import EmailPage from "next-common/components/emailPage/email";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default EmailPage;

export const getServerSideProps = serverSidePropsWithSummary;
