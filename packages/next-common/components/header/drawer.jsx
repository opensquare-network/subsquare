import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import NetworkSwitch from "next-common/components/header/networkSwitch";
import NodeSwitch from "next-common/components/header/nodeSwitch";
import Flex from "next-common/components/styled/flex";
import { accountMenu } from "./consts";
import PrimaryButton from "../buttons/primaryButton";
import { logoutUser, useUser, useUserDispatch } from "../../context/user";
import { useChainSettings } from "../../context/chain";
import Profile from "../../assets/imgs/icons/profile.svg";
import SearchInput from "./searchInput";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import SystemUser from "../user/systemUser";

const Wrapper = styled.div``;

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--textTertiary);
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
  color: var(--textSecondary);
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  border-radius: 4px;
  :hover {
    background: var(--neutral200);
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const UserWrapper = styled(Flex)`
  border: 1px solid var(--neutral400);
  border-radius: 8px;
  padding: 0 12px;
  height: 38px;
  font-weight: 500;
  margin-bottom: 8px;
  > :first-child {
    margin-right: 8px;
  }
`;

function ProfileMenuItem({ onClick }) {
  return (
    <Item onClick={onClick}>
      <Profile />
      <span>Profile</span>
    </Item>
  );
}

export default function SidebarAccount() {
  const user = useUser();
  const router = useRouter();
  const node = useChainSettings();
  const userDispatch = useUserDispatch();
  const { openLoginPopup } = useLoginPopup();

  const handleAccountMenu = async (item) => {
    if (item.value === "logout") {
      await logoutUser(userDispatch);
    } else if (item.pathname) {
      await router.push(item.pathname);
    }
  };

  const openUserProfile = () => {
    router.push(`/user/${user.address}`);
  };

  return (
    <Wrapper>
      <SearchInput shortcut={false} inputType="search" />

      <Title>NETWORK</Title>
      <NetworkSwitch activeNode={node} />
      {node?.hideHeight ? null : <Title>NODE</Title>}
      <NodeSwitch />
      <Title>ACCOUNT</Title>
      {!user && (
        <ButtonWrapper>
          <PrimaryButton onClick={openLoginPopup}>Login</PrimaryButton>
        </ButtonWrapper>
      )}
      {user && (
        <div>
          <UserWrapper>
            <SystemUser user={user} noEvent />
          </UserWrapper>
          {user.address && <ProfileMenuItem onClick={openUserProfile} />}
          {accountMenu.map((item, index) => (
            <Item key={index} onClick={() => handleAccountMenu(item)}>
              {item.icon}
              <span>{item.name}</span>
            </Item>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
