import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "components/layout";
import Button from "components/button";
import { useIsMounted } from "utils/hooks";
import nextApi from "services/nextApi";
import ErrorText from "components/ErrorText";
import {withLoginUser, withLoginUserRedux} from "../lib";

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
  box-shadow:0 6px 7px rgba(30, 33, 52, 0.02),
   0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
   0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
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

export default withLoginUserRedux(({
  loginUser,
}) => {
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;
  const [countdown, setCountdown] = useState(3);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (email && token) {
      setLoading(true);
      const doVerify = async (email, token) => {
        const res = await nextApi.post("auth/verify", {
          email,
          token,
        });
        if (res.result) {
          setSuccess(true);
        } else if (res.error) {
          setErrors(res.error);
        }
        setLoading(false);
      };
      doVerify(email, token);
    } else {
    }
  }, [email, token]);

  useEffect(() => {
    if (!success) return;
    if (countdown !== 0) {
      setTimeout(() => {
        if (isMounted.current) {
          setCountdown(countdown - 1);
        }
      }, 1000);
    } else {
      router.replace("/");
    }
  }, [success, countdown]);

  return (
    <Layout user={loginUser}>
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
  return {
    props: {
    },
  };
});
