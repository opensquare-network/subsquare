import styled from "styled-components";

import Layout from "components/layout";
import { withLoginUser, withLoginUserRedux } from "../lib";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  Title,
} from "components/login/styled";
import { p_14_normal } from "../styles/componentCss";
import { Option } from "next-common/components/addressSelect";
import Input from "next-common/components/input";
import FlexBetween from "next-common/components/styled/flexBetween";
import { useEffect, useState } from "react";
import Button from "next-common/components/button";
import { useRouter } from "next/router";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import { newErrorToast, newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { nodes } from "next-common/utils/constants";
import { encodeAddressToChain } from "next-common/services/address";

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
  > div{
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
  background: #F6F7FA;
`

const SubButton = styled.button`
  all: unset;
  font-size: 12px;
  font-weight: 500;
  color: #6848FF;
  cursor: pointer;
`;

const Text = styled.span`
  color:#9DA9BB;
`

export default withLoginUserRedux(({loginUser, chain}) => {
  const address = loginUser?.addresses?.find(address => address.chain === chain)?.address
  const [identity, setIdentity] =useState();
  const [loading , setLoading] = useState(false);
  const [verifySent, setVerifySent] = useState(false);
  const [errors, setErrors] = useState();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const router = useRouter();
  const counter = useCountdown(60);
  const dispatch = useDispatch();

  //todo: extract this into a hook useIdentityEmail()
  useEffect(()=>{
    const identityChain = nodes.find((n) => n.value === chain)?.identity;
    if (!identityChain) return;
    const identityAddress = encodeAddressToChain(address, identityChain);
    fetch(`${process.env.NEXT_PUBLIC_IDENTITY_SERVER_HOST}/${identityChain}/identity/${identityAddress}`,)
      .then((res) => res.json())
      .then((identity) => {
        setIdentity(identity)
      })
      .catch(() => {});
  },[address, chain]);

  useEffect(()=>{
    if(errors){
      setErrors(null);
    }
  },[email, pin]);

  useEffect(()=>{
    if (counter.countdown === 0){
      setVerifySent(false);
    }
  }, [counter.countdown, verifySent]);

  const send = async () => {
      const res = await nextApi.post("user/setemail", {
        email,
        sendCode:true,
      });
      if (res.result) {
        setVerifySent(true);
        counter.startCountdown();
        dispatch(
          newSuccessToast(
            "The verification code has been send to your email, Please check."
          )
        );
      } else if (res.error) {
        setErrors(res.error);
      }
  };

  const submit = async () => {
    try {
      setLoading(true);
      const res = await nextApi.post("auth/verify", {
        email,
        token: pin,
      });
      if (res.result) {
        setVerifySent(true);
        counter.startCountdown();
        dispatch(
          newSuccessToast(
            "Verification code has been confirmed, you can subscribe for notifications now."
          )
        );
        router.replace("/");
      } else if (res.error) {
        setErrors(res.error);
      }
    }catch (e) {
      dispatch(newErrorToast(e.message));
    }finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Set Email`} desc={`Set Email`}/>
      <Wrapper>
        <ContentCenterWrapper>
          <Title>Login {` with Web3 address`}</Title>
          <Hint>Set email for receiving notifications</Hint>
          <Label>Web3 address</Label>
          <Option item={{address}} chain={chain} selected/>
          <FlexBetween>
            <Label>Email</Label>
            {
              identity?.info?.email &&<SubButton onClick={()=>setEmail(identity?.info?.email)}>Use identity email</SubButton>
            }
          </FlexBetween>
          <Input
            placeholder="Please fill email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors?.data?.email}
          />
          {
            email && (email !== identity?.info?.email) && <>
            <FlexBetween>
              <Label>Verify Email</Label>
              {verifySent ?<Text>{counter.countdown}</Text>: <SubButton onClick={send}>Send Code</SubButton>}
            </FlexBetween>
              <Input
                placeholder="Please fill PIN code"
                name="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                error={errors?.data?.token}
              />
            </>
          }
          <Button isFill secondary type="submit" onClick={submit} isLoading={loading}>
            Confirm
          </Button>
          <Button isFill onClick={()=>{router.replace("/")}}>
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
