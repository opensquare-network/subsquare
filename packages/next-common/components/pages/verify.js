import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import NextHead from "next-common/components/nextHead";
import { Info, Redirect } from "next-common/components/login/styled";
import SecondaryButton from "next-common/lib/button/secondary";
import { LoginCard } from "../styled/containers/loginCard";
import {
  fetchAndUpdateUserStatus,
  useSetUser,
  useUserContext,
} from "next-common/context/user";

export default function Verify() {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;
  const isMounted = useMountedState();
  const { countdown, counting: success, startCountdown } = useCountdown(3);
  const setUser = useSetUser();
  const userContext = useUserContext();

  useEffect(() => {
    if (success && countdown === 0) {
      router.replace("/");
    }
  }, [success, countdown, router]);

  useEffect(() => {
    if (!email || !token) {
      return;
    }

    setLoading(true);

    nextApi
      .post("auth/verify", {
        email,
        token,
      })
      .then(({ result, error }) => {
        if (result) {
          if (isMounted()) {
            setUser(result);
            fetchAndUpdateUserStatus(userContext);
            startCountdown();
          }
        } else if (error) {
          if (isMounted()) {
            setErrors(error);
          }
        }
      })
      .finally(() => {
        if (isMounted()) {
          setLoading(false);
        }
      });
  }, [email, token, isMounted, startCountdown, setUser, userContext]);

  return (
    <>
      <NextHead title={"Verify email"} desc={"Verify email"} />
      <LoginCard className="mt-[12vh] mx-auto">
        {!success && (
          <>
            <h3 className="text20Bold text-textPrimary">Verify Email</h3>
            {loading && <Info>Please wait for a moment...</Info>}
            {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
          </>
        )}
        {success && (
          <>
            <h3 className="text20Bold text-textPrimary">Congrats</h3>
            <Info>Your email has been verified.</Info>
            <SecondaryButton
              className="w-full"
              onClick={() => router.replace("/")}
            >
              Got it
            </SecondaryButton>
            <Redirect>
              The page will be re-directed in
              <span className="sec">{countdown}s</span>
            </Redirect>
          </>
        )}
      </LoginCard>
    </>
  );
}
