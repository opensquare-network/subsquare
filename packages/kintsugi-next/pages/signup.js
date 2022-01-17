import styled from "styled-components";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "components/layout";
import Button from "next-common/components/button";
import Input from "components/input";
import { useForm, useIsMounted } from "utils/hooks";
import nextApi from "services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { useAuthPage } from "utils/hooks";
import { withLoginUser, withLoginUserRedux } from "lib";
import { useDispatch } from "react-redux";
import { addToast } from "store/reducers/toastSlice";
import { shadow_100 } from "styles/componentCss";
import NextHead from "components/nextHead";
import UserPolicy from "components/userPolicy";

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

  > button:last-child {
    margin-top: 12px;
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
  useAuthPage(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(!!loginUser);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const [sendEmailState, setSendEmailState] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [checked, setChecked] = useState(false);
  const [agreeError, setAgreeError] = useState();
  const isMounted = useIsMounted();

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      username: "",
      email: "",
      password: "",
    },
    async (formData) => {
      if (!checked) {
        setAgreeError("You must accept our terms");
        return;
      }
      setLoading(true);
      const res = await nextApi.post("auth/signup", formData);
      if (res.result) {
        setSuccess(true);
        sendVerifyEmail();
      } else if (res.error) {
        setErrors(res.error);
      }
      setLoading(false);
    },
    () => setErrors(null)
  );
  const { username, email, password } = formData;

  const toastError = (message) => {
    dispatch(
      addToast({
        type: "error",
        message: message,
      })
    );
  };

  const sendVerifyEmail = () => {
    setSendEmailState(false);
    nextApi
      .post("user/resendverifyemail")
      .then(({ result, error }) => {
        if (result) {
          return setSendEmailState(true);
        }
        toastError(
          error?.message ?? "some error occured when sending an Email"
        );
      })
      .catch((err) => {
        toastError("some error occurred when sending an Email");
      });
  };

  useEffect(() => {
    if (loginUser?.emailVerified) {
      toastError("You have already verified email address.");
      return setTimeout(() => {
        // router.replace("/");
      }, 1000);
    }
  });

  useEffect(() => {
    if (!sendEmailState) return;
    if (countdown !== 0) {
      setTimeout(() => {
        if (isMounted.current) {
          setCountdown(countdown - 1);
        }
      }, 1000);
    } else {
      router.replace("/login");
    }
  }, [sendEmailState, countdown, isMounted, router]);

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Signup`} desc={`Signup`} />
      <Wrapper>
        {!success && (
          <ContentWrapper>
            <Title>Sign up</Title>
            <FormWrapper onSubmit={handleSubmit}>
              <InputWrapper>
                <Label>Username</Label>
                <Input
                  placeholder="Please fill your name"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={errors?.data?.username}
                />
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
                <Label>Password</Label>
                <Input
                  placeholder="Please fill password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={errors?.data?.password}
                />
                {errors?.message && !errors?.data && (
                  <ErrorText>{errors?.message}</ErrorText>
                )}
              </InputWrapper>
              <UserPolicy
                checked={checked}
                setChecked={setChecked}
                agreeError={agreeError}
                setAgreeError={setAgreeError}
              />
              <ButtonWrapper>
                <Button isFill secondary type="submit" isLoading={loading}>
                  Sign up
                </Button>
              </ButtonWrapper>
            </FormWrapper>
            <LinkWrapper>
              Already have a account? <Link href="/login">Login</Link>
            </LinkWrapper>
          </ContentWrapper>
        )}
        {success && (
          <ContentWrapper>
            <Title>{sendEmailState ? "Congrats." : "Sending..."}</Title>
            <InfoWrapper>
              {sendEmailState
                ? "We sent you an email to verify your address. Click on the link in the email."
                : "Sending an email to verify your address."}
            </InfoWrapper>
            <Button isFill secondary onClick={() => router.replace("/")}>
              Got it
            </Button>
            <Button isFill onClick={sendVerifyEmail}>
              Resend
            </Button>
            {sendEmailState && (
              <Redirect>
                The page will be re-directed in
                <span className="sec">{countdown}s</span>
              </Redirect>
            )}
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
