import styled, { css } from "styled-components";
import { useState } from "react";

import NetworkSwitch from "components/networkSwitch";
import Container from "components/container";
import HeaderAccount from "./headerAccount";
import Sidebar from "./sidebar";
import SidebarAccount from "./sidebarAccount";
import { nodes } from "utils/constants";
import NodeSwitch from "components/nodeSwitch";
import { useRouter } from "next/router";
import Flex from "../common/flex";

const Wrapper = styled.header`
  padding-left: 32px;
  padding-right: 32px;
  @media screen and (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
  @media screen and (max-height: 750px) {
    position: initial;
  }
  ${(props) =>
    props &&
    props.fixedTop &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
    `}
  background: #ffffff;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
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

const NetworkWrapper = styled.div`
  width: 144px;
`;

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

export default function Header({ user, left, chain, fixedTop = false }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState("left");
  const [content, setContent] = useState();

  const node = nodes.find((n) => n.value === chain) || nodes[0];

  return (
    <Wrapper fixedTop={fixedTop}>
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
                <img src="/imgs/icons/menu-line.svg" alt="" />
              </MenuButton>
            )}
            <LogoImg
              src="/imgs/logo.svg"
              alt=""
              onClick={() => {
                let currChain = chain;
                if (!currChain) {
                  currChain = localStorage.getItem("chain") || "karura";
                }
                router.push({
                  pathname: "/[chain]",
                  query: { chain: currChain },
                });
              }}
            />
            <NodeButton
              onClick={() => {
                setPosition("right");
                setContent("right");
                setShow(true);
              }}
            >
              <img src={`/imgs/icons/${node.icon}`} alt="" />
            </NodeButton>
          </Left>
          <Right>
            <HeaderAccount user={user} chain={chain} />
            {router.pathname.startsWith("/[chain]") && (
              <>
                <NetworkWrapper>
                  <NetworkSwitch activeNode={node} />
                </NetworkWrapper>
                <NodeSwitch small chain={chain} />
              </>
            )}
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
