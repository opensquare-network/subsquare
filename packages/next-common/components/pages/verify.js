import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "next-common/components/layout";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  InfoWrapper,
  Redirect,
} from "next-common/components/login/styled";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { PageTitleContainer } from "../styled/containers/titleContainer";

const Wrapper = styled.div`
  padding: 32px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;
  const isMounted = useIsMounted();
  const { countdown, counting: success, startCountdown } = useCountdown(3);

  if (success && countdown === 0) {
    router.replace("/login");
  }

  useEffect(() => {
    if (email && token) {
      setLoading(true);
      const doVerify = async (email, token) => {
        const res = await nextApi.post("auth/verify", {
          email,
          token,
        });
        if (res.result) {
          if (isMounted.current) {
            startCountdown();
          }
        } else if (res.error) {
          if (isMounted.current) {
            setErrors(res.error);
          }
        }
        if (isMounted.current) {
          setLoading(false);
        }
      };
      doVerify(email, token);
    } else {
    }
  }, [email, token, router, isMounted, startCountdown]);

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Verify email`} desc={`Verify email`} />
      <Wrapper>
        {!success && (
          <ContentCenterWrapper>
            <PageTitleContainer>Verify Email</PageTitleContainer>
            {loading && <InfoWrapper>Please wait for a moment...</InfoWrapper>}
            {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
          </ContentCenterWrapper>
        )}
        {success && (
          <ContentCenterWrapper>
            <PageTitleContainer>Congrats</PageTitleContainer>
            <InfoWrapper>Your email has been verified.</InfoWrapper>
            <SecondaryButton isFill onClick={() => router.replace("/")}>
              Got it
            </SecondaryButton>
            <Redirect>
              The page will be re-directed in
              <span className="sec">{countdown}s</span>
            </Redirect>
          </ContentCenterWrapper>
        )}
      </Wrapper>
    </Layout>
  );
});
