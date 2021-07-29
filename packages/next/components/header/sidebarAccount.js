import styled from "styled-components";
import { useState } from "react";

import NodeSwitch from "components/nodeSwitch";
import Button from "components/button";
import { accountMenu } from "utils/constants";

const Wrapper = styled.div`
  padding: 32px 0 0;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #9da9bb;
  margin-bottom: 16px;
  margin-top: 24px;
  :first-child {
    margin-top: 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  color: #506176;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  border-radius: 4px;
  :hover {
    background: #f6f7fa;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
  > img {
    flex: 0 0 24px;
    filter: invert(34%) sepia(48%) saturate(275%) hue-rotate(174deg)
      brightness(93%) contrast(85%);
  }
`;

export default function SidebarAccount() {
  const [login, setLogin] = useState(false);

  const handleAccountMenu = (value) => {
    if (value === "logout") {
      setLogin(false);
    }
  };

  return (
    <Wrapper>
      <Title>NETWORK</Title>
      <NodeSwitch />
      <Title>ACCOUNT</Title>
      {!login && (
        <ButtonWrapper>
          <Button primary>Sign up</Button>
          <Button onClick={() => setLogin(true)}>Login</Button>
        </ButtonWrapper>
      )}
      {login && (
        <div>
          {accountMenu.map((item, index) => (
            <Item key={index} onClick={() => handleAccountMenu(item.value)}>
              <img src={`/imgs/icons/${item.icon}`} />
              <div>{item.name}</div>
            </Item>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
