import { withLoginUser } from "next-common/lib";
import SignUpPage from "@subsquare/next/pages/signup";

export default SignUpPage;

export const getServerSideProps = withLoginUser();
