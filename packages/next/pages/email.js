import EmailPage from "next-common/components/emailPage/email";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default EmailPage;

export const getServerSideProps = getServerSidePropsWithTracks;
