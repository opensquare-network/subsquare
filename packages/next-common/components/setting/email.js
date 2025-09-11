import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "next-common/lib/input";
import ErrorText from "../ErrorText";
import nextApi from "../../services/nextApi";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import { EmailVerify, InputWrapper } from "./styled";
import CircleCheck from "../../assets/imgs/icons/circle-check.svg";
import CircleWarning from "../../assets/imgs/icons/circle-warning.svg";
import PrimaryButton from "next-common/lib/button/primary";
import EmailJunkWarning from "./emailJunkWarning";

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
      {email && <EmailJunkWarning />}
      <InputWrapper>
        <Input
          defaultValue={email}
          disabled
          post={
            verified ? (
              <EmailVerify>
                <CircleCheck />
                <div>Verified</div>
              </EmailVerify>
            ) : (
              <EmailVerify>
                <CircleWarning />
                <div>Unverified</div>
              </EmailVerify>
            )
          }
        />
        {!verified && (
          <PrimaryButton onClick={onResend} loading={resendLoading}>
            Resend
          </PrimaryButton>
        )}
      </InputWrapper>
      {resendErrors?.message && !resendErrors?.data && (
        <ErrorText>{resendErrors?.message}</ErrorText>
      )}
    </div>
  );
}
