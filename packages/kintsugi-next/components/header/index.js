import styled from "styled-components";
import { useState } from "react";
import Sidebar from "./sidebar";
import SidebarAccount from "./sidebarAccount";
import { nodes } from "next-common/utils/constants";
import Flex from "next-common/components/styled/flex";
import Link from "next/link";
import HeaderRight from "next-common/components/header/right";
import HeaderWrapper from "next-common/components/header/wrapper";

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

const MenuButton = styled(Flex)`
  display: none !important;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  width: 38px;
  height: 38px;
  justify-content: center;
  cursor: pointer;
  @media screen and (max-width: 1024px) {
    display: flex !important;
    margin-right: 12px;
  }
`;

const NetworkWrapper = styled.div``;

const NodeButton = styled(Flex)`
  display: none !important;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  width: 38px;
  height: 38px;
  justify-content: center;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    display: flex !important;
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
    <HeaderWrapper chain={chain}>
      <div>
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
          <HeaderRight chain={chain} user={user} isWeb3Login={isWeb3Login} />
        </FlexWrapper>
      </div>
      {show && (
        <Sidebar onClose={() => setShow(false)} position={position}>
          {content === "left" && <>{left}</>}
          {content === "right" && <SidebarAccount user={user} chain={chain} />}
        </Sidebar>
      )}
    </HeaderWrapper>
  );
}
