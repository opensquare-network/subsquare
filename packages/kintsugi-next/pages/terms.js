import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import Terms from "next-common/components/pages/terms";

export default withLoginUserRedux(Terms);

export const getServerSideProps = withLoginUser();
