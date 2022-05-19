import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";

import Layout from "components/layout";
import Button from "next-common/components/button";
import Input from "next-common/components/input";
import { useForm } from "utils/hooks";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { withLoginUser, withLoginUserRedux } from "../lib";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  Title,
  FormWrapper,
  FormInputsWrapper,
  Label,
  InfoWrapper,
} from "next-common/components/login/styled";

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      email: "",
    },
    async (formData) => {
      try {
        setLoading(true);
        const { result, error } = await nextApi.post("auth/forget", formData);
        if (result) {
          setSuccess(true);
        } else if (error) {
          setErrors(error);
        }
      } catch (e) {
        showErrorToast(e.message);
      } finally {
        setLoading(false);
      }
    },
    () => setErrors(null)
  );
  const { email } = formData;

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Forget password`} desc={`Forget password`} />
      <Wrapper>
        {!success && (
          <ContentCenterWrapper>
            <Title>Reset Password</Title>
            <FormWrapper onSubmit={handleSubmit}>
              <FormInputsWrapper>
                <Label>Email</Label>
                <Input
                  placeholder="Please fill email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={errors?.data?.email}
                />
              </FormInputsWrapper>
              {errors?.message && !errors?.data && (
                <ErrorText>{errors?.message}</ErrorText>
              )}
              <Button isFill secondary type="submit" isLoading={loading}>
                Confirm
              </Button>
            </FormWrapper>
          </ContentCenterWrapper>
        )}
        {success && (
          <ContentCenterWrapper>
            <Title>Reset Password</Title>
            <InfoWrapper>
              The reset password link was sent to this email, if it exists in
              our database.
            </InfoWrapper>
            <Button isFill secondary onClick={() => router.replace("/")}>
              Confirm
            </Button>
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
