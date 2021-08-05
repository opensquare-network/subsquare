import styled from "styled-components";

import Input from "./input";
import Button from "./button";

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.24);
  z-index: 999;
  top: 0;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
  width: 360px;
  margin: 122px auto 0;
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const InfoWrapper = styled.div`
  padding: 12px 16px;
  background: #fff1f0;
  border-radius: 4px;
  line-height: 150%;
  color: #f44336;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
`;

export default function DeleteAccount({ onClose }) {
  return (
    <Wrapper onClick={() => onClose()}>
      <ContentWrapper onClick={(event) => event.stopPropagation()}>
        <Title>Delete</Title>
        <InfoWrapper>
          Once you delete your account, there is no going back. Please be
          certain.
        </InfoWrapper>
        <div>
          <Label>Password</Label>
          <Input placeholder="Please fill password" type="password" />
        </div>
        <Button danger isFill>
          Delete my account
        </Button>
      </ContentWrapper>
    </Wrapper>
  );
}
