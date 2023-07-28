/* eslint-disable react/no-unescaped-entities */
import { useUser } from "next-common/context/user";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import useCountdown from "next-common/utils/hooks/useCountdown";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import GhostButton from "../buttons/ghostButton";
import PrimaryButton from "../buttons/primaryButton";
import ErrorText from "../ErrorText";
import styled from "styled-components";
import UserPolicy from "next-common/components/userPolicy";
import Input from "../input";
import useForm from "next-common/utils/hooks/useForm";
import tw from "tailwind-styled-components";

const Title = tw.div`
  text20Bold
  text-center
  text-textPrimary
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

const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default function LoginPopupSignUpContent({ onClose, setView }) {
  const loginUser = useUser();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(!!loginUser);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [agreeError, setAgreeError] = useState();
  const isMounted = useIsMounted();
  const { counting: emailSent, startCountdown } = useCountdown(3);

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
    <div className="space-y-6">
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
                Confirm
              </PrimaryButton>
            </ButtonWrapper>
          </FormWrapper>
          <div className="text-textSecondary text-center text14Medium">
            Already have a account?{" "}
            <span
              role="button"
              className="text-theme500"
              onClick={() => {
                setView("web3");
              }}
            >
              Login
            </span>
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
          <GhostButton
            isFill
            onClick={() => {
              onClose?.();
            }}
          >
            Close
          </GhostButton>

          {emailSent && (
            <div className="text-textSecondary text14Medium text-center">
              Didn't receive an email?{" "}
              <span
                role="button"
                className="text-theme500"
                onClick={sendVerifyEmail}
              >
                Resend
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
