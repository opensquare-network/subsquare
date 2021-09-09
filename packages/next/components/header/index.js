import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import Link from "next/link";

import NodeSwitch from "components/nodeSwitch";
import Container from "components/container";
import HeaderAccount from "./headerAccount";
import Sidebar from "./sidebar";
import { useWindowSize } from "utils/hooks";
import SidebarAccount from "./sidebarAccount";
import { nodes } from "utils/constants";

const Wrapper = styled.header`
  padding-left: 32px;
  padding-right: 32px;
  @media screen and (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
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

const FlexWrapper = styled.div`
  max-width: 1080px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    flex-grow: 1;
    justify-content: space-between;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 12px;
  }
  @media screen and (max-width: 768px) {
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
  @media screen and (max-width: 1080px) {
    display: flex;
    margin-right: 12px;
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
  const [show, setShow] = useState(false);
  // const [hiddenWidth, setHiddenWidth] = useState(0);
  const [position, setPosition] = useState("left");
  const [content, setContent] = useState();
  // const windowSize = useWindowSize();

  const node = nodes.find((n) => n.value === chain) || nodes[0];

  // useEffect(() => {
  //   if (hiddenWidth && windowSize.width && windowSize.width > hiddenWidth) {
  //     setShow(false);
  //   }
  // }, [windowSize, hiddenWidth]);

  return (
    <Wrapper fixedTop={fixedTop}>
      <Container>
        <FlexWrapper>
          <Left>
            {left && (
              <MenuButton
                onClick={() => {
                  // setHiddenWidth(1024);
                  setPosition("left");
                  setContent("left");
                  setShow(true);
                }}
              >
                <img src="/imgs/icons/menu-line.svg" alt="" />
              </MenuButton>
            )}
            <Link href="/">
              <LogoImg src="/imgs/logo.svg" alt="" />
            </Link>
            <NodeButton
              onClick={() => {
                // setHiddenWidth(768);
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
            <NodeWrapper>
              <NodeSwitch activeNode={node} />
            </NodeWrapper>
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
