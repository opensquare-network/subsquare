import { withLoginUser } from "next-common/lib";
import Forget from "next-common/components/pages/forget";

export default Forget;

export const getServerSideProps = withLoginUser();
