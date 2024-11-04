import styled from "styled-components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "next-common/components/input";
import { useMountedState } from "react-use";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import NextHead from "next-common/components/nextHead";
import UserPolicy from "next-common/components/userPolicy";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import useForm from "next-common/utils/hooks/useForm";
import { LoginCard } from "next-common/components/styled/containers/loginCard";
import { useSetUser, useUser } from "next-common/context/user";
import { withCommonProps } from "next-common/lib";
import { WarningMessage } from "next-common/components/setting/styled";
import { useChainSettings } from "next-common/context/chain";

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
  const user = useUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(!!user);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [agreeError, setAgreeError] = useState();
  const isMounted = useMountedState();
  const { countdown, counting: emailSent, startCountdown } = useCountdown(3);
  const setUser = useSetUser();
  const { sima } = useChainSettings();
  const disabledForm = !!sima;

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
        if (isMounted()) {
          setUser(res.result);
          setSuccess(true);
        }
        sendVerifyEmail();
      } else if (res.error) {
        if (isMounted()) {
          setErrors(res.error);
        }
      }
      if (isMounted()) {
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
          if (isMounted()) {
            startCountdown();
          }
          return;
        }
        if (isMounted()) {
          showErrorToast(
            error?.message ?? "some error occured when sending an Email",
          );
        }
      })
      .catch(() => {
        if (isMounted()) {
          showErrorToast("some error occurred when sending an Email");
        }
      });
  };

  useEffect(() => {
    if (user?.emailVerified) {
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
              {disabledForm && (
                <WarningMessage>
                  To align with the goal of web3, registration via email is no
                  longer available. Please connect SubSquare with an address.
                </WarningMessage>
              )}
              <InputWrapper>
                <Label>Username</Label>
                <Input
                  disabled={disabledForm}
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
                  disabled={disabledForm}
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
                  disabled={disabledForm}
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
                disabled={disabledForm}
                checked={checked}
                setChecked={setChecked}
                agreeError={agreeError}
                setAgreeError={setAgreeError}
              />
              <ButtonWrapper>
                <PrimaryButton
                  disabled={disabledForm}
                  className="w-full"
                  type="submit"
                  loading={loading}
                >
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
                className="w-full"
                secondary
                onClick={() => router.replace("/")}
              >
                Got it
              </PrimaryButton>
              <SecondaryButton className="w-full" onClick={sendVerifyEmail}>
                Resend
              </SecondaryButton>
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

export const getServerSideProps = withCommonProps();
