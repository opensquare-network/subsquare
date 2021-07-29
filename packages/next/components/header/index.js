import styled from "styled-components";
import { useState, useEffect } from "react";

import NodeSwitch from "components/nodeSwitch";
import Container from "components/container";
import Account from "./account";
import Sidebar from "./sidebar";
import { useWindowSize } from "utils/hooks";

const Wrapper = styled.header`
  background: #ffffff;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  height: 64px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 12px;
  }
  @media screen and (max-width: 600px) {
    flex-grow: 1;
    justify-content: space-between;
    > :not(:first-child) {
      margin-left: 0;
    }
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 12px;
  }
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const MenuButton = styled.div`
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  display: none;
  @media screen and (max-width: 900px) {
    display: flex;
  }
`;

const NodeWrapper = styled.div`
  width: 144px;
`;

const NodeButton = styled.div`
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  display: none;
  @media screen and (max-width: 600px) {
    display: flex;
  }
`;

export default function Header() {
  const [show, setShow] = useState(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width && windowSize.width > 900) {
      setShow(false);
    }
  }, [windowSize]);

  return (
    <Wrapper>
      <Container>
        <FlexWrapper>
          <Left>
            <MenuButton onClick={() => setShow(true)}>
              <img src="/imgs/icons/menu-line.svg" alt="" />
            </MenuButton>
            <img src="/imgs/logo.svg" alt="" />
            <NodeButton onClick={() => setShow(true)}>
              <img src="/imgs/icons/kusama.svg" alt="" />
            </NodeButton>
          </Left>
          <Right>
            <NodeWrapper>
              <NodeSwitch />
            </NodeWrapper>
            <Account />
          </Right>
        </FlexWrapper>
      </Container>
      {show && <Sidebar onClose={() => setShow(false)} />}
    </Wrapper>
  );
}
