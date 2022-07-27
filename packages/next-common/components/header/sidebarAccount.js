import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import NetworkSwitch from "next-common/components/header/networkSwitch";
import { nodes } from "next-common/utils/constants";
import { logout } from "next-common/store/reducers/userSlice";
import User from "next-common/components/user";
import NodeSwitch from "next-common/components/header/nodeSwitch";
import Flex from "next-common/components/styled/flex";
import { accountMenu } from "./consts";
import GhostButton from "../buttons/ghostButton";
import SecondaryButton from "../buttons/secondaryButton";

const Wrapper = styled.div`
  padding: 32px 0 0;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
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

const Item = styled(Flex)`
  color: ${(props) => props.theme.textSecondary};
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  border-radius: 4px;
  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const UserWrapper = styled(Flex)`
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
  padding: 0 12px;
  height: 38px;
  font-weight: 500;
  margin-bottom: 8px;
  > :first-child {
    margin-right: 8px;
  }
`;

export default function SidebarAccount({ user, chain }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const node = nodes.find((n) => n.value === chain) || nodes[0];

  const handleAccountMenu = (item) => {
    if (item.value === "logout") {
      dispatch(logout());
    } else if (item.pathname) {
      router.push(item.pathname);
    }
  };

  return (
    <Wrapper>
      <Title>NETWORK</Title>
      <NetworkSwitch activeNode={node} />
      {node?.hideHeight ? null : <Title>NODE</Title>}
      <NodeSwitch chain={chain} node={node} />
      <Title>ACCOUNT</Title>
      {!user && (
        <ButtonWrapper>
          <GhostButton onClick={() => router.push("/signup")}>
            Sign up
          </GhostButton>
          <SecondaryButton onClick={() => router.push("/login")}>
            Login
          </SecondaryButton>
        </ButtonWrapper>
      )}
      {user && (
        <div>
          <UserWrapper>
            <User user={user} chain={chain} noEvent />
          </UserWrapper>
          {accountMenu.map((item, index) => (
            <Item key={index} onClick={() => handleAccountMenu(item)}>
              {item.icon}
              <div>{item.name}</div>
            </Item>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
