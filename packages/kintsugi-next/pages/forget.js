import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";

import Layout from "components/layout";
import Button from "next-common/components/button";
import Input from "components/input";
import { useForm } from "utils/hooks";
import nextApi from "services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { useAuthPage } from "utils/hooks";
import { withLoginUser, withLoginUserRedux } from "lib";
import { useDispatch } from "react-redux";
import { addToast } from "store/reducers/toastSlice";
import { shadow_100 } from "styles/componentCss";
import NextHead from "components/nextHead";

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
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

const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  useAuthPage(false);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toastError = (message) => {
    dispatch(
      addToast({
        type: "error",
        message: message,
      })
    );
  };

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
          setErrors(res.error);
        }
      } catch (e) {
        toastError("some error occurred when sending an Email");
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
              The reset password link was sent to this email, if it exists in
              our database.
            </InfoWrapper>
            <Button isFill secondary onClick={() => router.replace("/")}>
              Confirm
            </Button>
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
