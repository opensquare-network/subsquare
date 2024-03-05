import React, { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useWindowSize from "../../utils/hooks/useWindowSize.js";
import { useIsLoggedIn, useUser } from "../../context/user";
import useIsMounted from "../../utils/hooks/useIsMounted";
import PrimaryButton from "../buttons/primaryButton.js";
import { useLoginPopup } from "next-common/hooks/useLoginPopup.js";
import GhostButton from "../buttons/ghostButton.js";
import { SystemProfile } from "@osn/icons/subsquare";
import { useConnectedAccountContext } from "next-common/context/connectedAccount/index.js";
import { SystemUser, AddressUser } from "../user";
import { useAccountMenu } from "./useAccountMenu.js";
import { Item, Menu, Wrapper } from "./headerAccountStyled.js";

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
  const isMounted = useIsMounted();
  const { openLoginPopup } = useLoginPopup();
  const menu = useAccountMenu();

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 600) {
      setShow(false);
    }
  }, [windowSize]);

  const handleAccountMenu = async (item) => {
    if (item.value === "logout") {
      await disconnectAccount();
    } else if (item.pathname) {
      await router.push(item.pathname);
    }

    if (isMounted.current) {
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
        <GhostButton onClick={() => setShow(!show)}>
          <SystemUser user={user} noEvent />
        </GhostButton>
      );
    } else {
      connectBtn = (
        <GhostButton onClick={() => setShow(!show)}>
          <AddressUser add={user?.address} noEvent />
        </GhostButton>
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
                <Item onClick={() => handleAccountMenu(item)}>
                  {item.icon}
                  <span>{item.name}</span>
                </Item>
              </Fragment>
            ))}
          </Menu>
        )}
      </Wrapper>
    </>
  );
}
