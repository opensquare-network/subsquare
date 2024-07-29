import NextHead from "next-common/components/nextHead";
import LoginContent from "../login";
import { LoginCard } from "../styled/containers/loginCard";

const Login = () => {
  return (
    <>
      <NextHead title={"Login"} desc={"Login"} />

      <LoginCard className="mt-[12vh] mx-auto">
        <LoginContent />
      </LoginCard>
    </>
  );
};

export default Login;
