import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import NextHead from "next-common/components/nextHead";
import { InfoWrapper, Redirect } from "next-common/components/login/styled";
import { PageTitleContainer } from "../styled/containers/titleContainer";
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
  const isMounted = useIsMounted();
  const { countdown, counting: success, startCountdown } = useCountdown(3);
  const setUser = useSetUser();
  const userContext = useUserContext();

  useEffect(() => {
    if (success && countdown === 0) {
      router.replace("/");
    }
  }, [success, countdown]);

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
          if (isMounted.current) {
            setUser(result);
            fetchAndUpdateUserStatus(userContext);
            startCountdown();
          }
        } else if (error) {
          if (isMounted.current) {
            setErrors(error);
          }
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
  }, [email, token, isMounted, startCountdown, setUser]);

  return (
    <>
      <NextHead title={"Verify email"} desc={"Verify email"} />
      <LoginCard className="mt-[12vh] mx-auto">
        {!success && (
          <>
            <PageTitleContainer>Verify Email</PageTitleContainer>
            {loading && <InfoWrapper>Please wait for a moment...</InfoWrapper>}
            {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
          </>
        )}
        {success && (
          <>
            <PageTitleContainer>Congrats</PageTitleContainer>
            <InfoWrapper>Your email has been verified.</InfoWrapper>
            <SecondaryButton isFill onClick={() => router.replace("/")}>
              Back to Overview
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
