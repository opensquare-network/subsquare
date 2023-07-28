import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useWindowSize from "../../utils/hooks/useWindowSize.js";
import User from "../user";
import Relative from "../styled/relative";
import Flex from "../styled/flex";
import { shadow_200 } from "../../styles/componentCss";
import { isKeyRegisteredUser } from "../../utils";
import { accountMenu, accountMenuForKeyAccount } from "./consts";
import { logoutUser, useUser, useUserDispatch } from "../../context/user";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Profile from "../../assets/imgs/icons/profile.svg";
import PrimaryButton from "../buttons/primaryButton.js";
import LoginPopup from "../login/popup.jsx";

const Wrapper = Relative;

const AccountButton = styled(Flex)`
  background: var(--neutral100);
  justify-content: center;
  border: 1px solid var(--neutral400);
  border-color: var(--neutral400);
  > div > span:last-child {
    color: var(--textPrimaryContrast);
  }

  border-radius: 4px;
  padding: 0 12px;
  height: 38px;
  cursor: pointer;
  font-weight: 500;
`;

const Menu = styled.div`
  ${shadow_200};
  border-radius: 4px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 8px 0;
  z-index: 999999;
  background: var(--neutral100);
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)}px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  border-color: var(--neutral300);
  color: var(--textPrimary);
`;

const Item = styled(Flex)`
  min-width: 160px;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
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
      <Profile />
      <span>Profile</span>
    </Item>
  );
}

export default function HeaderAccount() {
  const user = useUser();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const userDispatch = useUserDispatch();
  const isMounted = useIsMounted();
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 600) {
      setShow(false);
    }
  }, [windowSize]);

  const menu = isKeyRegisteredUser(user)
    ? accountMenuForKeyAccount
    : accountMenu;

  const handleAccountMenu = async (item) => {
    if (item.value === "logout") {
      await logoutUser(userDispatch);
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

  return (
    <>
      <Wrapper ref={ref}>
        {!user ? (
          <PrimaryButton
            onClick={() => {
              setLoginPopupOpen(true);
            }}
          >
            Login
          </PrimaryButton>
        ) : (
          <AccountButton onClick={() => setShow(!show)}>
            <User user={user} noEvent />
          </AccountButton>
        )}

        {show && (
          <Menu>
            {user?.address && <ProfileMenuItem onClick={openUserProfile} />}
            {menu.map((item, index) => (
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

      {loginPopupOpen && (
        <LoginPopup onClose={() => setLoginPopupOpen(false)} />
      )}
    </>
  );
}
