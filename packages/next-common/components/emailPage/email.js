import { useEffect } from "react";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import { useRouter } from "next/router";
import { LoginCard } from "../styled/containers/loginCard";
import LoginEmailContent from "../login/emailContent";

const EmailPage = withLoginUserRedux(({ loginUser }) => {
  const address = loginUser?.address;

  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      // router.push("/login");
    } else if (!address) {
      // router.push("/");
    }
  }, [address, loginUser, router]);

  return (
    <>
      <NextHead title={"Set Email"} desc={"Set Email"} />

      <LoginCard className="mt-[12vh] mx-auto">
        <LoginEmailContent />
      </LoginCard>
    </>
  );
});

export default EmailPage;
