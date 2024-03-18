import { useState } from "react";
import { useRouter } from "next/router";
import Input from "next-common/components/input";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import NextHead from "next-common/components/nextHead";
import {
  FormInputsWrapper,
  FormWrapper,
  InfoWrapper,
  Label,
  Redirect,
} from "next-common/components/login/styled";
import useForm from "../../utils/hooks/useForm";
import PrimaryButton from "next-common/lib/button/primary";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { LoginCard } from "../styled/containers/loginCard";

const Reset = () => {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;
  const isMounted = useIsMounted();
  const { countdown, counting: success, startCountdown } = useCountdown(3);

  if (success && countdown === 0) {
    router.replace("/");
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
    () => setErrors(null),
  );
  const { newPassword } = formData;

  return (
    <>
      <NextHead title={"Reset password"} desc={"Reset password"} />
      <LoginCard className="mt-[12vh] mx-auto">
        {!success && (
          <>
            <PageTitleContainer>Reset Password</PageTitleContainer>
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
              <PrimaryButton isFill type="submit" loading={loading}>
                Confirm
              </PrimaryButton>
            </FormWrapper>
          </>
        )}
        {success && (
          <>
            <PageTitleContainer>Congrats</PageTitleContainer>
            <InfoWrapper>Your password has been reset.</InfoWrapper>
            <PrimaryButton isFill secondary onClick={() => router.replace("/")}>
              Back to Overview
            </PrimaryButton>
            <Redirect>
              The page will be re-directed in
              <span className="sec">{countdown}s</span>
            </Redirect>
          </>
        )}
      </LoginCard>
    </>
  );
};

export default Reset;
