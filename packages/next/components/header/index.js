import styled from "styled-components";
import { useState } from "react";
import NetworkSwitch from "components/networkSwitch";
import Container from "components/container";
import HeaderAccount from "next-common/components/header/headerAccount";
import Sidebar from "./sidebar";
import SidebarAccount from "./sidebarAccount";
import { nodes } from "next-common/utils/constants";
import NodeSwitch from "components/nodeSwitch";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "../../styles/componentCss";
import Link from "next/link";

const Wrapper = styled.header`
  padding-left: 32px;
  padding-right: 32px;
  @media screen and (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: #ffffff;
  ${shadow_100};
  height: 64px;
  border-bottom: 1px solid #ebeef4;
`;

const FlexWrapper = styled(Flex)`
  max-width: 1080px;
  margin: auto;
  justify-content: space-between;
`;

const Left = styled(Flex)`
  @media screen and (max-width: 768px) {
    flex-grow: 1;
    justify-content: space-between;
  }
`;

const Right = styled(Flex)`
  > :not(:first-child) {
    margin-left: 12px;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MenuButton = styled(Flex)`
  display: none;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  width: 38px;
  height: 38px;
  justify-content: center;
  cursor: pointer;
  @media screen and (max-width: 1024px) {
    display: flex;
    margin-right: 12px;
  }
`;

const NetworkWrapper = styled.div``;

const NodeButton = styled(Flex)`
  display: none;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  width: 38px;
  height: 38px;
  justify-content: center;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

const LogoImg = styled.img`
  cursor: pointer;
  width: 161px;
  height: 64px;
`;

export default function Header({ user, left, chain, isWeb3Login }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState("left");
  const [content, setContent] = useState();

  const node = nodes.find((n) => n.value === chain) || nodes[0];

  return (
    <Wrapper>
      <Container>
        <FlexWrapper>
          <Left>
            {left && (
              <MenuButton
                onClick={() => {
                  setPosition("left");
                  setContent("left");
                  setShow(true);
                }}
              >
                <img
                  src="/imgs/icons/menu-line.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </MenuButton>
            )}
            <Link href="/">
              <a>
                <LogoImg src="/imgs/logo.svg" alt="" />
              </a>
            </Link>
            <NodeButton
              onClick={() => {
                setPosition("right");
                setContent("right");
                setShow(true);
              }}
            >
              <img
                src={`/imgs/icons/${node.icon}`}
                alt=""
                width={24}
                height={24}
              />
            </NodeButton>
          </Left>
          <Right>
            <HeaderAccount user={user} chain={chain} />
            {
              <>
                <NetworkWrapper>
                  <NetworkSwitch activeNode={node} isWeb3Login={isWeb3Login} />
                </NetworkWrapper>
                <NodeSwitch small chain={chain} node={node} />
              </>
            }
          </Right>
        </FlexWrapper>
      </Container>
      {show && (
        <Sidebar onClose={() => setShow(false)} position={position}>
          {content === "left" && <>{left}</>}
          {content === "right" && <SidebarAccount user={user} chain={chain} />}
        </Sidebar>
      )}
    </Wrapper>
  );
}
