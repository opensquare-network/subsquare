import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import Layout from "next-common/components/layout";
import Input from "next-common/components/input";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { withLoginUserRedux } from "next-common/lib";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  FormInputsWrapper,
  FormWrapper,
  InfoWrapper,
  Label,
} from "next-common/components/login/styled";
import useForm from "../../utils/hooks/useForm";
import SecondaryButton from "../buttons/secondaryButton";
import { PageTitleContainer } from "../styled/containers/titleContainer";

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
`;

const Forget = withLoginUserRedux(({ loginUser, chain }) => {
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
            <PageTitleContainer>Reset Password</PageTitleContainer>
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
              <SecondaryButton isFill type="submit" isLoading={loading}>
                Confirm
              </SecondaryButton>
            </FormWrapper>
          </ContentCenterWrapper>
        )}
        {success && (
          <ContentCenterWrapper>
            <PageTitleContainer>Reset Password</PageTitleContainer>
            <InfoWrapper>
              The reset password link was sent to this email, if it exists in
              our database.
            </InfoWrapper>
            <SecondaryButton isFill onClick={() => router.replace("/")}>
              Confirm
            </SecondaryButton>
          </ContentCenterWrapper>
        )}
      </Wrapper>
    </Layout>
  );
});

export default Forget;
