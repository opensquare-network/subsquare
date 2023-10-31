import styled from "styled-components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "next-common/components/input";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import NextHead from "next-common/components/nextHead";
import UserPolicy from "next-common/components/userPolicy";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import GhostButton from "next-common/components/buttons/ghostButton";
import useForm from "next-common/utils/hooks/useForm";
import { LoginCard } from "next-common/components/styled/containers/loginCard";
import { updateUser, useUser, useUserDispatch } from "next-common/context/user";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  line-height: 20px;
  color: var(--textPrimary);
`;

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

const InputWrapper = styled.div``;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 12px;
  color: var(--textPrimary);
  :not(:first-child) {
    margin-top: 16px;
  }
`;

const InfoWrapper = styled.div`
  padding: 12px 16px;
  background: var(--neutral200);
  border-radius: 4px;
  line-height: 150%;
  color: var(--textSecondary);
`;

const Redirect = styled.div`
  text-align: center;
  color: var(--textSecondary);

  .sec {
    font-weight: bold;
    color: var(--theme500);
    margin-left: 8px;
  }
`;

const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default function Signup() {
  const loginUser = useUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(!!loginUser);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [agreeError, setAgreeError] = useState();
  const isMounted = useIsMounted();
  const { countdown, counting: emailSent, startCountdown } = useCountdown(3);
  const userDispatch = useUserDispatch();

  if (emailSent && countdown === 0) {
    router.replace("/");
  }

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
        if (isMounted.current) {
          updateUser(res.result, userDispatch);
          setSuccess(true);
        }
        sendVerifyEmail();
      } else if (res.error) {
        if (isMounted.current) {
          setErrors(res.error);
        }
      }
      if (isMounted.current) {
        setLoading(false);
      }
    },
    () => setErrors(null),
  );
  const { username, email, password } = formData;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const sendVerifyEmail = () => {
    nextApi
      .post("user/resendverifyemail")
      .then(({ result, error }) => {
        if (result) {
          if (isMounted.current) {
            startCountdown();
          }
          return;
        }
        if (isMounted.current) {
          showErrorToast(
            error?.message ?? "some error occured when sending an Email",
          );
        }
      })
      .catch(() => {
        if (isMounted.current) {
          showErrorToast("some error occurred when sending an Email");
        }
      });
  };

  useEffect(() => {
    if (loginUser?.emailVerified) {
      showErrorToast("You have already verified email address.");
      return setTimeout(() => {
        // router.replace("/");
      }, 1000);
    }
  });

  return (
    <>
      <NextHead title={"Signup"} desc={"Signup"} />

      <LoginCard className="mt-[12vh] mx-auto">
        {!success && (
          <>
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
                <PrimaryButton isFill type="submit" isLoading={loading}>
                  Sign up
                </PrimaryButton>
              </ButtonWrapper>
            </FormWrapper>
            <div className="text14Medium text-center text-textSecondary">
              Already have a account?{" "}
              <Link className="text-theme500" href="/login" replace>
                Login
              </Link>
            </div>
          </>
        )}
        {success && (
          <>
            <Title>{emailSent ? "Congrats." : "Sending..."}</Title>
            <InfoWrapper>
              {emailSent
                ? "We sent you an email to verify your address. Click on the link in the email."
                : "Sending an email to verify your address."}
            </InfoWrapper>
            <div className="space-y-2">
              <PrimaryButton
                isFill
                secondary
                onClick={() => router.replace("/")}
              >
                Got it
              </PrimaryButton>
              <GhostButton isFill onClick={sendVerifyEmail}>
                Resend
              </GhostButton>
              {emailSent && (
                <Redirect>
                  The page will be re-directed in
                  <span className="sec">{countdown}s</span>
                </Redirect>
              )}
            </div>
          </>
        )}
      </LoginCard>
    </>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
