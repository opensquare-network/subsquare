import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import NetworkSwitch from "next-common/components/header/networkSwitch";
import NodeSwitch from "next-common/components/header/nodeSwitch";
import Flex from "next-common/components/styled/flex";
import PrimaryButton from "next-common/lib/button/primary";
import { useUser } from "../../context/user";
import { useChainSettings } from "../../context/chain";
import Profile from "../../assets/imgs/icons/profile.svg";
import SearchInput from "./searchInput";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useAccountMenu } from "./useAccountMenu";
import Divider from "next-common/components/styled/layout/divider";
import SwitchAccount from "next-common/components/switchAccount";
import AddressUser from "next-common/components/user/addressUser";
import SearchInputWithPopup from "./searchInputWithPopup";

const Wrapper = styled.div``;

const Title = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: var(--textPrimary);
  margin-bottom: 8px;
  margin-top: 16px;
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

function ProfileMenuItem({ onClick }) {
  return (
    <Item onClick={onClick}>
      <Profile />
      <span className="text14Medium text-textPrimary">Profile</span>
    </Item>
  );
}

function ConnectedAccount({ user }) {
  if (!user?.address) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-neutral200 border-none h-10 mb-2 pl-2 pr-4">
      <AddressUser add={user?.address} key={user?.address} />
      <span className="text12Medium text-textTertiary">Connected</span>
    </div>
  );
}

export default function SidebarAccount() {
  const user = useUser();
  const router = useRouter();
  const node = useChainSettings();
  const { openLoginPopup } = useLoginPopup();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();
  const accountMenu = useAccountMenu();
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const chainSettings = useChainSettings();
  const {
    modules: { referenda: hasReferenda },
  } = chainSettings;

  const handleAccountMenu = async (item) => {
    if (item.value === "logout") {
      await disconnectAccount();
    } else if (item.value === "switch") {
      setShowSwitchAccount(true);
    } else if (item.pathname) {
      await router.push(item.pathname);
    }
  };

  const openUserProfile = () => {
    router.push(`/user/${user.address}`);
  };

  return (
    <Wrapper>
      {hasReferenda ? (
        <SearchInputWithPopup type="search" />
      ) : (
        <SearchInput shortcut={false} type="search" />
      )}

      <Title>NETWORK</Title>
      <NetworkSwitch activeNode={node} />
      {node?.hideHeight ? null : <Title>NODE</Title>}
      <NodeSwitch />
      <Title>ACCOUNT</Title>
      {!user && (
        <ButtonWrapper>
          <PrimaryButton onClick={() => openLoginPopup()}>
            Connect
          </PrimaryButton>
        </ButtonWrapper>
      )}
      {user && (
        <div>
          <ConnectedAccount user={user} />
          {user.address && <ProfileMenuItem onClick={openUserProfile} />}
          {accountMenu.map((item, index) => (
            <Fragment key={index}>
              {item?.value === "switch" && <Divider className="my-2" />}
              <Item onClick={() => handleAccountMenu(item)}>
                {item.icon}
                <span className="text14Medium text-textPrimary">
                  {item.name}
                </span>
              </Item>
            </Fragment>
          ))}
        </div>
      )}
      {showSwitchAccount && (
        <SwitchAccount
          onClose={() => {
            setShowSwitchAccount(false);
          }}
          onOpenLogin={() => {
            openLoginPopup();
            setShowSwitchAccount(false);
          }}
        />
      )}
    </Wrapper>
  );
}
