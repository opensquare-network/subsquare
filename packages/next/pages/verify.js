import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "components/layout";
import Button from "next-common/components/button";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { withLoginUser, withLoginUserRedux } from "../lib";
import { shadow_100 } from "../styles/componentCss";
import NextHead from "next-common/components/nextHead";

const Wrapper = styled.div`
  padding: 32px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  width: 360px;
  margin: 0 auto;
  padding: 48px;
  > :not(:first-child) {
    margin-top: 24px;
  }
  @media screen and (max-width: 392px) {
    width: 100%;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const InfoWrapper = styled.div`
  padding: 12px 16px;
  background: #f6f7fa;
  border-radius: 4px;
  line-height: 150%;
  color: #506176;
`;

const Redirect = styled.div`
  text-align: center;
  color: #506176;
  .sec {
    font-weight: bold;
    color: #6848ff;
    margin-left: 8px;
  }
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;
  const isMounted = useIsMounted();
  const { countdown, running: success, startCountdown } = useCountdown({ initSeconds: 3 });

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
  }, [email, token, router, isMounted]);

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Verify email`} desc={`Verify email`} />
      <Wrapper>
        {!success && (
          <ContentWrapper>
            <Title>Verify Email</Title>
            {loading && <InfoWrapper>Please wait for a moment...</InfoWrapper>}
            {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
          </ContentWrapper>
        )}
        {success && (
          <ContentWrapper>
            <Title>Congrats</Title>
            <InfoWrapper>Your email has been verified.</InfoWrapper>
            <Button isFill secondary onClick={() => router.replace("/")}>
              Got it
            </Button>
            <Redirect>
              The page will be re-directed in
              <span className="sec">{countdown}s</span>
            </Redirect>
          </ContentWrapper>
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
