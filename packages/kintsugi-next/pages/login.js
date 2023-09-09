import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import Login from "next-common/components/pages/login";

export default withLoginUserRedux(Login);

export const getServerSideProps = withLoginUser();
