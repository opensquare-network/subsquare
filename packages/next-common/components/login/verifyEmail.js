import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import Input from "../input";
import useCountdown from "../../utils/hooks/useCountdown";
import FlexBetween from "../styled/flexBetween";
import nextApi from "../../services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "../../store/reducers/toastSlice";
import Loading from "../loading";

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
`;

const Text = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textTertiary};
`;

const SubButton = styled.button`
  all: unset;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.primaryPurple500};
  cursor: pointer;
`;

const SendButton = ({ loading = false, onClick = () => {} }) => {
  if (loading) {
    return <Loading />;
  }
  return <SubButton onClick={onClick}>Send Code</SubButton>;
};

export default function VerifyEmail({ pin, setPin, email, errors, setErrors }) {
  const dispatch = useDispatch();
  const { countdown, startCountdown } = useCountdown(60);
  const [verifySent, setVerifySent] = useState(false);
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (countdown === 0) {
      setVerifySent(false);
    }
  }, [countdown, verifySent]);

  const send = async () => {
    setSending(true);
    try {
      const { result, error } = await nextApi.post("user/setemail", {
        email,
        sendCode: true,
      });
      if (result) {
        setVerifySent(true);
        startCountdown();
        dispatch(
          newSuccessToast(
            "The verification code has been send to your email, Please check."
          )
        );
      } else if (error) {
        setErrors(error);
        if (error.message) {
          dispatch(newErrorToast(error.message));
        }
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <FlexBetween>
        <Label>Verify Email</Label>
        {verifySent ? (
          <Text>{countdown}s</Text>
        ) : (
          <SendButton onClick={send} loading={sending} />
        )}
      </FlexBetween>
      <Input
        placeholder="Please fill PIN code"
        name="pin"
        value={pin}
        onChange={(e) => {
          setPin(e.target.value);
          setErrors(null);
        }}
        error={errors?.data?.token}
      />
    </>
  );
}
