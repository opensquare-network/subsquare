import styled from "styled-components";
import { useState } from "react";

import Layout from "components/layout";
import Input from "components/input";
import Button from "components/button";
import DeleteAccount from "components/deleteAccount";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
  }
`;

const Label = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 12px;
  :not(:first-child) {
    margin-top: 16px;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  > :first-child {
    flex-grow: 1;
  }
  > :only-child {
    margin-right: 96px;
  }
  > :not(:only-child):last-child {
    width: 80px;
    margin-left: 16px;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    > :only-child {
      margin-right: 0;
    }
    > :not(:only-child):last-child {
      margin-left: 0;
      margin-top: 8px;
    }
  }
`;

const Divider = styled.div`
  background: #ebeef4;
  height: 1px;
  margin: 24px 0;
`;

const EmailVerify = styled.div`
  display: flex;
  align-items: center;
  color: #9da9bb;
  height: 38px;
  padding-right: 16px;
  > img {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }
`;

const ButtonWrapper = styled.div`
  max-width: 240px;
`;

export default function Account() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Layout>
        <Wrapper>
          <Title>Account</Title>
          <ContentWrapper>
            <div>
              <Label>Username</Label>
              <InputWrapper>
                <Input defaultValue="Name XXX" disabled />
              </InputWrapper>
            </div>
            <Divider />
            <div>
              <Label>Email</Label>
              <InputWrapper>
                <Input
                  defaultValue="alcazarrr@outlook.com"
                  disabled
                  post={
                    <EmailVerify>
                      <img src="/imgs/icons/circle-check.svg" />
                      <div>Verified</div>
                    </EmailVerify>
                  }
                />
                <Button secondary>Resend</Button>
              </InputWrapper>
            </div>
            <Divider />
            <div>
              <Label>Current password</Label>
              <InputWrapper>
                <Input
                  placeholder="Please fill current password"
                  type="password"
                />
              </InputWrapper>
              <Label>Current password</Label>
              <InputWrapper>
                <Input placeholder="Please fill new password" type="password" />
                <Button secondary>Change</Button>
              </InputWrapper>
            </div>
            <Divider />
            <div>
              <Label>Log out</Label>
              <ButtonWrapper>
                <Button isFill>Logout my account</Button>
              </ButtonWrapper>
            </div>
            <Divider />
            <div>
              <Label>Delete account</Label>
              <ButtonWrapper>
                <Button isFill danger onClick={() => setShow(true)}>
                  Delete my account
                </Button>
              </ButtonWrapper>
            </div>
          </ContentWrapper>
        </Wrapper>
      </Layout>
      {show && <DeleteAccount onClose={() => setShow(false)} />}
    </>
  );
}
