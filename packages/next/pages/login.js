import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";

import Layout from "components/layout";
import Agreement from "components/agreement";
import Button from "components/button";
import Input from "components/input";
import AddressSelect from "components/addressSelect";

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  min-width: 360px;
  margin: 0 auto;
  padding: 48px;
  > :not(:first-child) {
    margin-top: 24px;
  }
  @media screen and (max-width: 392px) {
    min-width: 0;
    width: 100%;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

const LinkWrapper = styled.div`
  color: #506176;
  text-align: center;
  a {
    font-weight: bold;
    color: #6848ff;
  }
`;

const InputWrapper = styled.div``;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  :not(:first-child) {
    margin-top: 16px;
  }
`;

const ForgetPassword = styled.div`
  margin-top: 8px;
  color: #9da9bb;
  font-size: 12px;
`;

export default function Login() {
  const [web3, setWeb3] = useState(false);

  return (
    <Layout>
      <Wrapper>
        <ContentWrapper>
          <Title>Login</Title>
          {!web3 && (
            <>
              <InputWrapper>
                <Label>Username</Label>
                <Input placeholder="Please fill your name" />
                <Label>Password</Label>
                <Input placeholder="Please fill password" type="password" />
                <ForgetPassword>
                  <Link href="forget">Forget password?</Link>
                </ForgetPassword>
              </InputWrapper>
              <ButtonWrapper>
                <Button isFill secondary>
                  Login
                </Button>
                <Button isFill onClick={() => setWeb3(true)}>
                  Login with web3 address
                </Button>
              </ButtonWrapper>
            </>
          )}
          {web3 && (
            <>
              <div>
                <Label>Choose linked address</Label>
                <AddressSelect />
              </div>
              <ButtonWrapper>
                <Button isFill secondary>
                  Login
                </Button>
                <Button isFill onClick={() => setWeb3(false)}>
                  Login with username
                </Button>
              </ButtonWrapper>
            </>
          )}
          <LinkWrapper>
            Don’t have a account? <Link href="/signup">Sign up</Link>
          </LinkWrapper>
        </ContentWrapper>
        <Agreement />
      </Wrapper>
    </Layout>
  );
}
