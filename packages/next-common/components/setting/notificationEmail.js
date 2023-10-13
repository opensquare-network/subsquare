import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import Input from "../input";
import ErrorText from "../ErrorText";
import nextApi from "../../services/nextApi";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import { EmailVerify, InputWrapper } from "./styled";
import useCountdown from "../../utils/hooks/useCountdown";
import CircleCheck from "../../assets/imgs/icons/circle-check.svg";
import CircleWarning from "../../assets/imgs/icons/circle-warning.svg";
import { fetchAndUpdateUser, useUserDispatch } from "../../context/user";
import PrimaryButton from "../buttons/primaryButton";
import EmailJunkWarning from "./emailJunkWarning";

const CountdownWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;

  width: 72px;
  height: 40px;

  border: 1px solid var(--neutral400);
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;

  text-align: center;
  color: var(--textPrimary);
`;

export default function NotificationEmail({ email, verified }) {
  const dispatch = useDispatch();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendErrors, setResendErrors] = useState();
  const [inputEmail, setInputEmail] = useState(email);
  const { countdown, counting, startCountdown, resetCountdown } =
    useCountdown(60);
  const userDispatch = useUserDispatch();

  useEffect(() => {
    if (counting && countdown % 5 === 0) {
      fetchAndUpdateUser(userDispatch).then(() => {
        // todo: maybe log the count
      });
    }
  }, [userDispatch, counting, countdown]);

  if (counting && (countdown === 0 || (email === inputEmail && verified))) {
    resetCountdown();
  }

  const onResend = async () => {
    setResendLoading(true);
    const { result, error } = await nextApi.post("user/setemail", {
      email: inputEmail,
    });
    if (result) {
      startCountdown();
      dispatch(
        newSuccessToast(
          "The verification link has been send to your email, Please check.",
        ),
      );
    } else if (error) {
      setResendErrors(error);
    }
    setResendLoading(false);
  };

  let emailVerified = <></>;
  if (email) {
    if (verified && inputEmail === email) {
      emailVerified = (
        <EmailVerify>
          <CircleCheck />
          <div>Verified</div>
        </EmailVerify>
      );
    } else {
      emailVerified = (
        <EmailVerify>
          <CircleWarning />
          <div>Unverified</div>
        </EmailVerify>
      );
    }
  }

  return (
    <div>
      {email && <EmailJunkWarning />}
      <InputWrapper>
        <Input
          placeholder="Please fill Email..."
          defaultValue={inputEmail}
          post={emailVerified}
          onChange={(e) => {
            setInputEmail(e.target.value);
            setResendErrors();
          }}
        />
        {counting ? (
          <CountdownWrapper>{countdown}s</CountdownWrapper>
        ) : (
          (!verified || inputEmail !== email) && (
            <PrimaryButton
              onClick={onResend}
              isLoading={resendLoading}
              style={{ width: 72, height: 40 }}
            >
              Verify
            </PrimaryButton>
          )
        )}
      </InputWrapper>
      {resendErrors?.message && <ErrorText>{resendErrors?.message}</ErrorText>}
    </div>
  );
}
