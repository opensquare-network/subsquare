import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "./sidebar";
import SidebarAccount from "./sidebarAccount";
import Flex from "next-common/components/styled/flex";
import HeaderRight from "next-common/components/header/right";
import HeaderWrapper from "next-common/components/header/wrapper";
import ChainLogo from "next-common/components/header/left/chainLogo";
import ChainIcon from "next-common/components/header/chainIcon";
import MenuLine from "../../assets/imgs/icons/menu-line.svg";
import { useChain } from "../../context/chain";
import SearchInput from "./searchInput";
import { hidden, m_l, m_r, w_full } from "../../styles/tailwindcss";
import { mdcss } from "../../utils/responsive";

const FlexWrapper = styled(Flex)`
  max-width: 1184px;
  margin: auto;
  justify-content: space-between;
`;

const Left = styled(Flex)`
  @media screen and (max-width: 768px) {
    flex-grow: 1;
    justify-content: space-between;
  }
`;

const HeaderSearchInputWrapper = styled.div`
  ${w_full};
  ${m_r(12)};
  ${m_l(35)};

  ${mdcss(hidden)};
`;

const MenuButton = styled(Flex)`
  background: ${(props) => props.theme.neutral};
  display: none !important;
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
  width: 38px;
  height: 38px;
  justify-content: center;
  cursor: pointer;
  @media screen and (max-width: 1024px) {
    display: flex !important;
    margin-right: 12px;
  }
  svg path {
    stroke: ${(props) => props.theme.textTertiary};
  }
`;

const NodeButton = styled(Flex)`
  display: none !important;
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
  width: 38px;
  height: 38px;
  justify-content: center;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    display: flex !important;
  }
`;

export default function Header({ left }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState("left");
  const [content, setContent] = useState();
  const chain = useChain();

  return (
    <HeaderWrapper>
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
                <MenuLine />
              </MenuButton>
            )}
            <ChainLogo />
            <NodeButton
              onClick={() => {
                setPosition("right");
                setContent("right");
                setShow(true);
              }}
            >
              <ChainIcon chain={chain} />
            </NodeButton>
          </Left>

          <HeaderSearchInputWrapper>
            <SearchInput />
          </HeaderSearchInputWrapper>

          <HeaderRight />
        </FlexWrapper>
      </div>
      {show && (
        <Sidebar onClose={() => setShow(false)} position={position}>
          {content === "left" && <>{left}</>}
          {content === "right" && <SidebarAccount />}
        </Sidebar>
      )}
    </HeaderWrapper>
  );
}
