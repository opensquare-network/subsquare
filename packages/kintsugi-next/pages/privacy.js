import { withLoginUser } from "next-common/lib";
import Privacy from "next-common/components/pages/privacy";

export default Privacy;

export const getServerSideProps = withLoginUser();
