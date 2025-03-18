import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useWindowSize from "../../utils/hooks/useWindowSize.js";
import Relative from "../styled/relative";
import Flex from "../styled/flex";
import { useIsLoggedIn, useUser } from "../../context/user";
import { useClickAway, useMountedState } from "react-use";
import PrimaryButton from "next-common/lib/button/primary";
import { useLoginPopup } from "next-common/hooks/useLoginPopup.js";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemProfile } from "@osn/icons/subsquare";
import { useConnectedAccountContext } from "next-common/context/connectedAccount/index.js";
import { AddressUser, SystemUser } from "../user";
import { useAccountMenu } from "./useAccountMenu.js";
import Divider from "next-common/components/styled/layout/divider";
import SwitchWeb3 from "next-common/components/switchWeb3";

const Wrapper = Relative;

const Menu = styled.div`
  border-radius: 8px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 8px 0;
  z-index: 999999;
  background: var(--neutral100);
  border-width: 1px;
  border-style: solid;
  border-color: var(--neutral300);
  color: var(--textPrimary);
  box-shadow: var(--shadow200);
`;

const Item = styled(Flex)`
  min-width: 192px;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  :hover {
    background: var(--neutral200);
  }
  color: var(--textPrimary);

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

function ProfileMenuItem({ onClick }) {
  return (
    <Item onClick={onClick}>
      <SystemProfile className="[&_path]:fill-textSecondary" />
      <span>Profile</span>
    </Item>
  );
}

export default function HeaderAccount() {
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const isMounted = useMountedState();
  const { openLoginPopup } = useLoginPopup();
  const menu = useAccountMenu();
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);

  useClickAway(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 600) {
      setShow(false);
    }
  }, [windowSize]);

  const handleAccountMenu = async (item) => {
    if (item.value === "logout") {
      await disconnectAccount();
    } else if (item.value === "switch") {
      setShowSwitchAccount(true);
    } else if (item.pathname) {
      await router.push(item.pathname);
    }

    if (isMounted()) {
      setShow(false);
    }
  };

  const openUserProfile = () => {
    router.push(`/user/${user.address}`);
  };

  let connectBtn = (
    <PrimaryButton onClick={() => openLoginPopup()}>Connect</PrimaryButton>
  );
  if (user) {
    if (isLoggedIn) {
      connectBtn = (
        <SecondaryButton onClick={() => setShow(!show)}>
          <SystemUser user={user} noEvent />
        </SecondaryButton>
      );
    } else {
      connectBtn = (
        <SecondaryButton onClick={() => setShow(!show)}>
          <AddressUser add={user?.address} noEvent />
        </SecondaryButton>
      );
    }
  }

  return (
    <>
      <Wrapper ref={ref}>
        {connectBtn}

        {show && (
          <Menu>
            {user?.address && <ProfileMenuItem onClick={openUserProfile} />}
            {menu?.map((item, index) => (
              <Fragment key={index}>
                {item?.value === "switch" && <Divider className="my-2" />}
                <Item onClick={() => handleAccountMenu(item)}>
                  {item.icon}
                  <span>{item.name}</span>
                </Item>
              </Fragment>
            ))}
          </Menu>
        )}
      </Wrapper>
      {showSwitchAccount && (
        <SwitchWeb3
          onClose={() => {
            setShowSwitchAccount(false);
          }}
          onOpenLogin={() => {
            openLoginPopup();
            setShowSwitchAccount(false);
          }}
        />
      )}
    </>
  );
}
