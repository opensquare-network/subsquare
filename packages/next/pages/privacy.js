import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import Privacy from "next-common/components/pages/privacy";

export default withLoginUserRedux(Privacy);

export const getServerSideProps = withLoginUser();
