import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";

import Layout from "components/layout";
import Agreement from "components/agreement";
import Button from "components/button";
import Input from "components/input";
import { useForm } from "utils/hooks";
import nextApi from "services/nextApi";
import ErrorText from "components/ErrorText";
import { setUser } from "store/reducers/userSlice";
import { useAuthPage } from "utils/hooks";
import { withLoginUser, withLoginUserRedux } from "../lib";

const AddressLogin = dynamic(() => import("components/addressLogin"), {
  ssr: false,
});

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

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

const LinkWrapper = styled.div`
  color: #506176;
  text-align: center;
  a {
    font-weight: bold;
    color: #6848ff;
  }
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

const ForgetPassword = styled.div`
  margin-top: 8px;
  color: #9da9bb;
  font-size: 12px;
`;

const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default withLoginUserRedux(({ loginUser }) => {
  useAuthPage(false);
  const [web3, setWeb3] = useState(false);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      usernameOrEmail: "",
      password: "",
    },
    async (formData) => {
      setLoading(true);
      const res = await nextApi.post("auth/login", formData);
      if (res.result) {
        dispatch(setUser(res.result));
        router.replace("/");
      } else if (res.error) {
        setErrors(res.error);
      }
      setLoading(false);
    }
  );
  const { usernameOrEmail, password } = formData;

  return (
    <Layout user={loginUser}>
      <Wrapper>
        <ContentWrapper>
          <Title>Login</Title>
          {!web3 && (
            <FormWrapper onSubmit={handleSubmit}>
              <InputWrapper>
                <Label>Username</Label>
                <Input
                  placeholder="Please fill your name or email"
                  name="usernameOrEmail"
                  value={usernameOrEmail}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors(null);
                  }}
                  error={errors?.data?.usernameOrEmail}
                />
                <Label>Password</Label>
                <Input
                  placeholder="Please fill password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors(null);
                  }}
                  error={errors?.data?.password}
                />
                {errors?.message && !errors?.data && (
                  <ErrorText>{errors?.message}</ErrorText>
                )}
                <ForgetPassword>
                  <Link href="/forget">Forget password?</Link>
                </ForgetPassword>
              </InputWrapper>
              <ButtonWrapper>
                <Button isFill secondary type="submit" isLoading={loading}>
                  Login
                </Button>
                <Button isFill onClick={() => setWeb3(true)}>
                  Login with web3 address
                </Button>
              </ButtonWrapper>
            </FormWrapper>
          )}
          {web3 && <AddressLogin onBack={() => setWeb3(false)} />}
          <LinkWrapper>
            Don’t have a account? <Link href="/signup">Sign up</Link>
          </LinkWrapper>
        </ContentWrapper>
        <Agreement />
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
