import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../input";
import Button from "../button";
import ErrorText from "../ErrorText";
import nextApi from "../../services/nextApi";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import {
  Label,
  InputWrapper,
  EmailVerify,
} from "./styled";

export default function Email({ email, verified }) {
  const dispatch = useDispatch();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendErrors, setResendErrors] = useState();

  const onResend = async () => {
    setResendLoading(true);
    const res = await nextApi.post("user/resendverifyemail");
    if (res.result) {
      dispatch(newSuccessToast("Resend email successfully!"));
    } else if (res.error) {
      setResendErrors(res.error);
    }
    setResendLoading(false);
  };

  return (
    <div>
      <Label>Email</Label>
      <InputWrapper>
        <Input
          defaultValue={email}
          disabled
          post={
            verified ? (
              <EmailVerify>
                <img alt="" src="/imgs/icons/circle-check.svg" />
                <div>Verified</div>
              </EmailVerify>
            ) : (
              <EmailVerify>
                <img alt="" src="/imgs/icons/circle-warning.svg" />
                <div>Unverified</div>
              </EmailVerify>
            )
          }
        />
        {!verified && (
          <Button
            secondary
            onClick={onResend}
            isLoading={resendLoading}
          >
            Resend
          </Button>
        )}
      </InputWrapper>
      {resendErrors?.message && !resendErrors?.data && (
        <ErrorText>{resendErrors?.message}</ErrorText>
      )}
    </div>
  )
}
