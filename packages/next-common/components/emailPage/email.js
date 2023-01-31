import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import { ContentCenterWrapper } from "next-common/components/login/styled";
import { Option } from "next-common/components/addressSelect";
import { useRouter } from "next/router";
import VerifyEmail from "next-common/components/login/verifyEmail";
import EmailInput from "next-common/components/login/emailInput";
import ConfirmEmail from "next-common/components/login/confirmEmail";
import useIdentity from "next-common/utils/hooks/useIdentity";
import { p_14_normal } from "../../styles/componentCss";
import GhostButton from "../buttons/ghostButton";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import BaseLayout from "../layout/baseLayout";
import { CACHE_KEY } from "../../utils/constants";
import CheckboxIcon from "../../components/icons/checkbox";
import { useCookieValue } from "../../utils/hooks/useCookieValue";

const Label = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 12px;
`;

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > div {
    > :not(:first-child) {
      margin-top: 12px;
    }
  }
`;

const Hint = styled.p`
  margin-top: 24px !important;
  padding: 12px 16px;
  ${p_14_normal};
  color: ${(props) => props.theme.textSecondary};
  background: ${(props) => props.theme.grey100Bg};
  border-color: ${(props) => props.theme.grey300Border};
`;

const BorderRadiusWrapper = styled.div`
  > div,
  p {
    border-radius: 4px;
  }
`;

const DontRemindWrapper = styled.span`
  user-select: none;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;
const DontRemindText = styled.span`
  margin-left: 8px;
  color: ${(p) => p.theme.textSecondary};
  ${p_14_normal};
`;

const EmailPage = withLoginUserRedux(({ loginUser, chain }) => {
  const address = loginUser?.address;
  const [accountName, setAccountName] = useState("");
  const [errors, setErrors] = useState();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [dontRemindEmail, setDontRemindEmail] = useCookieValue(
    CACHE_KEY.dontRemindEmail,
    false
  );

  const identity = useIdentity(address, chain);

  const router = useRouter();

  useEffect(() => {
    try {
      const accountMap = JSON.parse(
        localStorage.getItem(CACHE_KEY.accountMap) ?? "{}"
      );
      const accountName = accountMap[address];
      setAccountName(accountName);
    } catch (e) {
      // fixme: ignore
    }
  }, []);

  useEffect(() => {
    if (loginUser === null) {
      // router.push("/login");
    } else if (!address) {
      // router.push("/");
    }
  }, [address, loginUser, router]);

  function toggleDontRemindEmail() {
    setDontRemindEmail(!dontRemindEmail);
  }

  return (
    <BaseLayout>
      <NextHead title={`Set Email`} desc={`Set Email`} />
      <Wrapper>
        <ContentCenterWrapper>
          <PageTitleContainer>Login {` with Web3 address`}</PageTitleContainer>
          <BorderRadiusWrapper>
            <Hint>Set email for receiving notifications</Hint>
            <Label>Web3 address</Label>
            <Option item={{ address, name: accountName }} selected />
          </BorderRadiusWrapper>
          <EmailInput
            identity={identity}
            email={email}
            setEmail={setEmail}
            errors={errors}
            setErrors={setErrors}
          />
          {email &&
            (email !== identity?.info?.email || !identity?.isAuthorized) && (
              <VerifyEmail
                pin={pin}
                setPin={setPin}
                email={email}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          <ConfirmEmail
            pin={pin}
            email={email}
            identity={identity}
            setErrors={setErrors}
          />
          <GhostButton
            isFill
            onClick={() => {
              router.replace(router.query?.redirect || "/");
            }}
          >
            Skip
          </GhostButton>

          <DontRemindWrapper onClick={toggleDontRemindEmail}>
            <CheckboxIcon checked={dontRemindEmail} />
            <DontRemindText>Dont't remind me next time</DontRemindText>
          </DontRemindWrapper>
        </ContentCenterWrapper>
      </Wrapper>
    </BaseLayout>
  );
});

export default EmailPage;
