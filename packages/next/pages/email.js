import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import EmailPage from "next-common/components/emailPage/email";

export default withLoginUserRedux(EmailPage);

export const getServerSideProps = withLoginUser();
