import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "next-common/components/layout";
import Button from "next-common/components/button";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { withLoginUser, withLoginUserRedux } from "../lib";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  Title,
  InfoWrapper,
  Redirect,
} from "next-common/components/login/styled";

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
            <Title>Verify Email</Title>
            {loading && <InfoWrapper>Please wait for a moment...</InfoWrapper>}
            {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
          </ContentCenterWrapper>
        )}
        {success && (
          <ContentCenterWrapper>
            <Title>Congrats</Title>
            <InfoWrapper>Your email has been verified.</InfoWrapper>
            <Button isFill secondary onClick={() => router.replace("/")}>
              Got it
            </Button>
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

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
