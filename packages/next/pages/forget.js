import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";

import Layout from "components/layout";
import Button from "components/button";
import Input from "components/input";
import { useForm } from "utils/hooks";
import nextApi from "services/nextApi";
import ErrorText from "components/ErrorText";
import { useAuthPage } from "utils/hooks";

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
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

const InputWrapper = styled.div``;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
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

const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default function Forget() {
  useAuthPage(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      email: "",
    },
    async (formData) => {
      setLoading(true);
      const res = await nextApi.post("auth/forget", formData);
      if (res.result) {
        setSuccess(true);
      } else if (res.error) {
        setErrors(res.error);
      }
      setLoading(false);
    }
  );
  const { email } = formData;

  return (
    <Layout>
      <Wrapper>
        {!success && (
          <ContentWrapper>
            <Title>Reset Password</Title>
            <FormWrapper onSubmit={handleSubmit}>
              <InputWrapper>
                <Label>Email</Label>
                <Input
                  placeholder="Please fill email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors(null);
                  }}
                  error={errors?.data?.email}
                />
              </InputWrapper>
              {errors?.message && !errors?.data && (
                <ErrorText>{errors?.message}</ErrorText>
              )}
              <Button isFill secondary type="submit" isLoading={loading}>
                Confirm
              </Button>
            </FormWrapper>
          </ContentWrapper>
        )}
        {success && (
          <ContentWrapper>
            <Title>Reset Password</Title>
            <InfoWrapper>
              The reset password link was sent to this email, if it exist in our
              database.
            </InfoWrapper>
            <Button isFill secondary onClick={() => router.replace("/")}>
              Confirm
            </Button>
          </ContentWrapper>
        )}
      </Wrapper>
    </Layout>
  );
}
