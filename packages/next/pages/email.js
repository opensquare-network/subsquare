import styled from "styled-components";

import Layout from "components/layout";
import { withLoginUser, withLoginUserRedux } from "../lib";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  Title,
} from "next-common/components/login/styled";
import { p_14_normal } from "../styles/componentCss";
import { Option } from "next-common/components/addressSelect";
import { useEffect, useState } from "react";
import Button from "next-common/components/button";
import { useRouter } from "next/router";
import VerifyEmail from "next-common/components/login/verifyEmail";
import EmailInput from "next-common/components/login/emailInput";
import ConfirmEmail from "next-common/components/login/confirmEmail";
import useIdentity from "next-common/utils/hooks/useIdentity";

const Label = styled.div`
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
  color: #506176;
  background: #f6f7fa;
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  const address = loginUser?.addresses?.find(
    (address) => address.chain === chain
  )?.address;
  const [errors, setErrors] = useState();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  const identity = useIdentity(address, chain);

  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/login");
    } else if (!address) {
      router.push("/");
    }
  }, [address, loginUser, router]);

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Set Email`} desc={`Set Email`} />
      <Wrapper>
        <ContentCenterWrapper>
          <Title>Login {` with Web3 address`}</Title>
          <Hint>Set email for receiving notifications</Hint>
          <Label>Web3 address</Label>
          <Option item={{ address }} chain={chain} selected />
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
          <Button
            isFill
            onClick={() => {
              router.replace("/");
            }}
          >
            Remind me later
          </Button>
        </ContentCenterWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
