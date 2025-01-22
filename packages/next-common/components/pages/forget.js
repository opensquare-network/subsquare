import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "next-common/lib/input";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import NextHead from "next-common/components/nextHead";
import {
  FormInputsWrapper,
  FormWrapper,
  Info,
  Label,
} from "next-common/components/login/styled";
import useForm from "../../utils/hooks/useForm";
import PrimaryButton from "next-common/lib/button/primary";
import { LoginCard } from "../styled/containers/loginCard";

const Forget = () => {
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
    () => setErrors(null),
  );
  const { email } = formData;

  return (
    <>
      <NextHead title={"Forget password"} desc={"Forget password"} />
      <LoginCard className="mt-[12vh] mx-auto">
        <h3 className="text20Bold text-textPrimary">
          <span>{"Reset "}</span>
          <span className="text-theme500">Password</span>
        </h3>
        {!success && (
          <>
            <Info>Verify your email to set a new password</Info>
            <FormWrapper onSubmit={handleSubmit}>
              <FormInputsWrapper>
                <Label>Account</Label>
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
              <PrimaryButton className="w-full" type="submit" loading={loading}>
                Confirm
              </PrimaryButton>
            </FormWrapper>
          </>
        )}
        {success && (
          <>
            <Info>
              The reset password link was sent to this email, if it exists in
              our database.
            </Info>
            <PrimaryButton
              className="w-full"
              onClick={() => router.replace("/")}
            >
              Confirm
            </PrimaryButton>
          </>
        )}
      </LoginCard>
    </>
  );
};

export default Forget;
