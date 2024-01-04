import Web2Account from "next-common/components/setting/pages/web2Account";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default Web2Account;

export const getServerSideProps = serverSidePropsWithSummary;
