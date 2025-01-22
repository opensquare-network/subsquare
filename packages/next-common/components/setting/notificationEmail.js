import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import Input from "next-common/lib/input";
import ErrorText from "../ErrorText";
import nextApi from "../../services/nextApi";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import { EmailVerify } from "./styled";
import useCountdown from "../../utils/hooks/useCountdown";
import CircleCheck from "../../assets/imgs/icons/circle-check.svg";
import CircleWarning from "../../assets/imgs/icons/circle-warning.svg";
import {
  fetchAndUpdateUser,
  useUser,
  useUserContext,
} from "../../context/user";
import PrimaryButton from "next-common/lib/button/primary";
import EmailJunkWarning from "./emailJunkWarning";
import { LinkEmail } from "@osn/icons/subsquare";
import Switch from "./switch";
import { isKeyRegisteredUser } from "next-common/utils";
import SecondaryButton from "next-common/lib/button/secondary";

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 40px;

  svg {
    width: 24px;
    height: 24px;
    path {
      fill: var(--textTertiary);
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-grow: 1;

  > :first-child {
    flex-grow: 1;
  }
`;

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

export default function NotificationEmail({ isOn, setIsOn }) {
  const dispatch = useDispatch();
  const user = useUser();
  const isWeb3User = user && isKeyRegisteredUser(user);
  const email = user?.email;
  const verified = user?.emailVerified;
  const [resendLoading, setResendLoading] = useState(false);
  const [resendErrors, setResendErrors] = useState();
  const [inputEmail, setInputEmail] = useState(email);
  const { countdown, counting, startCountdown, resetCountdown } =
    useCountdown(60);
  const userContext = useUserContext();

  useEffect(() => {
    if (counting && countdown % 5 === 0) {
      fetchAndUpdateUser(userContext);
    }
  }, [userContext, counting, countdown]);

  if (counting && (countdown === 0 || (email === inputEmail && verified))) {
    resetCountdown();
  }

  const onVerify = async () => {
    setResendLoading(true);
    setResendErrors();

    let promise;
    if (isWeb3User) {
      promise = nextApi.post("user/setemail", {
        email: inputEmail,
      });
    } else {
      promise = nextApi.post("user/resendverifyemail");
    }
    const { result, error } = await promise;
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

  const onToggle = () => {
    setIsOn(!isOn);
  };

  const verify = counting ? (
    <div className="flex items-center max-sm:hidden">
      <CountdownWrapper>{countdown}s</CountdownWrapper>
    </div>
  ) : (
    inputEmail &&
    (!verified || inputEmail !== email) && (
      <div className="flex items-center max-sm:hidden">
        <PrimaryButton
          onClick={onVerify}
          loading={resendLoading}
          style={{ width: 72, height: 40 }}
        >
          Verify
        </PrimaryButton>
      </div>
    )
  );

  const mbVerify = counting ? (
    <CountdownWrapper>{countdown}s</CountdownWrapper>
  ) : (
    inputEmail &&
    (!verified || inputEmail !== email) && (
      <SecondaryButton
        onClick={onVerify}
        loading={resendLoading}
        style={{ width: 72, height: 40 }}
      >
        Verify
      </SecondaryButton>
    )
  );

  return (
    <div>
      {email && <EmailJunkWarning />}
      <div className="flex max-sm:flex-col gap-[8px]">
        <div className="flex gap-[8px] grow">
          <div className="flex gap-[24px] grow max-sm:gap-[8px] max-sm:flex-col">
            <IconWrapper>
              <LinkEmail />
            </IconWrapper>
            <InputWrapper>
              <Input
                disabled={!isWeb3User}
                placeholder="Please fill Email..."
                defaultValue={inputEmail}
                suffix={emailVerified}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  setResendErrors();
                }}
              />
            </InputWrapper>
          </div>
          {verify}
        </div>
        <div className="flex items-center w-[140px] h-[40px] justify-between max-sm:w-full">
          <div>
            <div className="hidden max-sm:flex">{mbVerify}</div>
          </div>
          <Switch
            isUnset={!email || !verified}
            isOn={isOn}
            onToggle={onToggle}
          />
        </div>
      </div>

      {resendErrors?.message && <ErrorText>{resendErrors?.message}</ErrorText>}
    </div>
  );
}
