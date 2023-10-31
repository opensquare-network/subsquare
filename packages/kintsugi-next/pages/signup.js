import SignUpPage from "@subsquare/next/pages/signup";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default SignUpPage;

export const getServerSideProps = serverSidePropsWithSummary;
