import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";

import Layout from "components/layout";
import Button from "next-common/components/button";
import Input from "next-common/components/input";
import { useForm } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { withLoginUser, withLoginUserRedux } from "../lib";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  Title,
  FormWrapper,
  FormInputsWrapper,
  Label,
  InfoWrapper,
  Redirect,
} from "components/login/styled";

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
    },
    () => setErrors(null)
  );
  const { newPassword } = formData;


  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Reset password`} desc={`Reset password`} />
      <Wrapper>
        {!success && (
          <ContentCenterWrapper>
            <Title>Reset Password</Title>
            <FormWrapper onSubmit={handleSubmit}>
              <FormInputsWrapper>
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
              </FormInputsWrapper>
              <Button isFill secondary type="submit" isLoading={loading}>
                Confirm
              </Button>
            </FormWrapper>
          </ContentCenterWrapper>
        )}
        {success && (
          <ContentCenterWrapper>
            <Title>Congrats</Title>
            <InfoWrapper>Your password has been reset.</InfoWrapper>
            <Button isFill secondary onClick={() => router.replace("/login")}>
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
