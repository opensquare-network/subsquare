import styled, { css } from "styled-components";
import React from "react";
import ChainIcon from "./chainIcon";
import { nodes } from "../../utils/constants";
import Flex from "../styled/flex";

const Wrapper = styled.div`
`;

const GroupName = styled(Flex)`
  padding: 12px;

  font-weight: 700;
  font-size: 12px;
  line-height: 12px;

  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${(props) => props.theme.textTertiary};
`;

const GroupOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  padding: 0px;

`;

const Item = styled.a`
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => props.theme.textPrimary};
  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }
  ${(p) =>
    p.active &&
    css`
      background: ${(props) => props.theme.grey100Bg};
    `}
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
  }
  > img.logo {
    flex: 0 0 24px;
  }
`;

export default function NetworkOptionGroup({ groupName, activeNode, setShow }) {
  const filteredNodes = nodes.filter(({ group }) => group === groupName);
  return (
    <Wrapper>
      <GroupName>{groupName}</GroupName>
      <GroupOptions>
        {filteredNodes.map((item, index) => (
          <Item
            key={index}
            onClick={() => {
              setShow(false);
            }}
            active={activeNode.value === filteredNodes[index].value}
            href={
              activeNode.value === item.value
                ? null
                : `https://${item.value}.subsquare.io`
            }
          >
            <ChainIcon chain={item.value} />
            <div>{item.name}</div>
          </Item>
        ))}
      </GroupOptions>
    </Wrapper>
  )
}
