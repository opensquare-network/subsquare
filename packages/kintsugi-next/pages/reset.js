import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "components/layout";
import Button from "next-common/components/button";
import Input from "next-common/components/input";
import { useForm } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import nextApi from "services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { withLoginUser, withLoginUserRedux } from "lib";
import NextHead from "components/nextHead";

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
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  width: 400px;
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
  line-height: 20px;
`;

const InputWrapper = styled.div``;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 12px;
  :not(:first-child) {
    margin-top: 16px;
  }
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

const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;
  const [countdown, setCountdown] = useState(3);
  const isMounted = useIsMounted();

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      newPassword: "",
    },
    async (formData) => {
      setLoading(true);
      const res = await nextApi.post("auth/reset", {
        email,
        token,
        ...formData,
      });
      if (res.result) {
        setSuccess(true);
      } else if (res.error) {
        setErrors(res.error);
      }
      setLoading(false);
    },
    () => setErrors(null)
  );
  const { newPassword } = formData;

  useEffect(() => {
    if (!success) return;
    if (countdown !== 0) {
      setTimeout(() => {
        if (isMounted.current) {
          setCountdown(countdown - 1);
        }
      }, 1000);
    } else {
      router.replace("/login");
    }
  }, [success, countdown, isMounted, router]);

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Reset password`} desc={`Reset password`} />
      <Wrapper>
        {!success && (
          <ContentWrapper>
            <Title>Reset Password</Title>
            <FormWrapper onSubmit={handleSubmit}>
              <InputWrapper>
                <Label>New Password</Label>
                <Input
                  placeholder="Please fill new password"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={errors?.data?.newPassword}
                />
                {errors?.message && !errors?.data && (
                  <ErrorText>{errors?.message}</ErrorText>
                )}
              </InputWrapper>
              <Button isFill secondary type="submit" isLoading={loading}>
                Confirm
              </Button>
            </FormWrapper>
          </ContentWrapper>
        )}
        {success && (
          <ContentWrapper>
            <Title>Congrats</Title>
            <InfoWrapper>Your password has been reset.</InfoWrapper>
            <Button isFill secondary onClick={() => router.replace("/login")}>
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
