import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Input from "next-common/components/input";
import Button from "next-common/components/button";
import ErrorText from "next-common/components/ErrorText";
import nextApi from "next-common/services/nextApi";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { fetchUserProfile } from "next-common/store/reducers/userSlice";
import { Label, InputWrapper, EmailVerify } from "components/setting/styled";
import useCountdown from "next-common/utils/hooks/useCountdown";

const CountdownWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;

  width: 80px;
  height: 38px;

  border: 1px solid #E0E4EB;
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;

  text-align: center;
  color: #1E2134;
`;

export default function NotificationEmail({ email, verified }) {
  const dispatch = useDispatch();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendErrors, setResendErrors] = useState();
  const [inputEmail, setInputEmail] = useState(email);
  const { countdown, counting, startCountdown, resetCountdown } =
    useCountdown(60);

  useEffect(() => {
    if (counting && countdown % 5 === 0) {
      dispatch(fetchUserProfile());
    }
  }, [counting, countdown]);

  if (counting && (countdown === 0 || email === inputEmail && verified)) {
    resetCountdown();
  }

  const onResend = async () => {
    setResendLoading(true);
    const res = await nextApi.post("user/setemail", {
      email: inputEmail,
    });
    if (res.result) {
      startCountdown();
      dispatch(
        newSuccessToast(
          "The verification link has been send to your email, Please check."
        )
      );
    } else if (res.error) {
      setResendErrors(res.error);
    }
    setResendLoading(false);
  };

  let emailVerified = <></>;
  if (email) {
    if (verified && inputEmail === email) {
      emailVerified = (
        <EmailVerify>
          <img alt="" src="/imgs/icons/circle-check.svg" />
          <div>Verified</div>
        </EmailVerify>
      );
    } else {
      emailVerified = (
        <EmailVerify>
          <img alt="" src="/imgs/icons/circle-warning.svg" />
          <div>Unverified</div>
        </EmailVerify>
      );
    }
  }

  return (
    <div>
      <Label>Notification Email</Label>
      <InputWrapper>
        <Input
          defaultValue={inputEmail}
          post={emailVerified}
          onChange={(e) => setInputEmail(e.target.value)}
        />
        {counting ? (
          <CountdownWrapper>{countdown}s</CountdownWrapper>
        ) : (
          (!verified || inputEmail !== email) && (
            <Button secondary onClick={onResend} isLoading={resendLoading}>
              Verify
            </Button>
          )
        )}
      </InputWrapper>
      {resendErrors?.message && !resendErrors?.data && (
        <ErrorText>{resendErrors?.message}</ErrorText>
      )}
    </div>
  );
}
