import { useState } from "react";
import { useRouter } from "next/router";
import Input from "next-common/lib/input";
import { useMountedState } from "react-use";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import NextHead from "next-common/components/nextHead";
import {
  FormInputsWrapper,
  FormWrapper,
  Info,
  Label,
  Redirect,
} from "next-common/components/login/styled";
import useForm from "../../utils/hooks/useForm";
import PrimaryButton from "next-common/lib/button/primary";
import { LoginCard } from "../styled/containers/loginCard";

const Reset = () => {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;
  const isMounted = useMountedState();
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
        if (isMounted()) {
          startCountdown();
        }
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
  const { newPassword } = formData;

  return (
    <>
      <NextHead title={"Reset password"} desc={"Reset password"} />
      <LoginCard className="mt-[12vh] mx-auto">
        {!success && (
          <>
            <h3 className="text20Bold text-textPrimary">
              <span>{"Reset "}</span>
              <span className="text-theme500">Password</span>
            </h3>
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
              <PrimaryButton className="w-full" type="submit" loading={loading}>
                Confirm
              </PrimaryButton>
            </FormWrapper>
          </>
        )}
        {success && (
          <>
            <h3 className="text20Bold text-textPrimary">Congrats</h3>
            <Info>Your password has been reset.</Info>
            <PrimaryButton
              className="w-full"
              secondary
              onClick={() => router.replace("/")}
            >
              Got it
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
