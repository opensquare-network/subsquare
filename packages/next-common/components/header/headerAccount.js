import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useWindowSize from "../../utils/hooks/useWindowSize.js";
import User from "../user";
import Relative from "../styled/relative";
import Flex from "../styled/flex";
import { shadow_200 } from "../../styles/componentCss";
import LoginButton from "./loginButton";
import { isKeyRegisteredUser } from "../../utils";
import { accountMenu, accountMenuForKeyAccount } from "./consts";
import { logoutUser, useUser, useUserDispatch } from "../../context/user";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Profile from "../../assets/imgs/icons/profile.svg";

const Wrapper = Relative;

const AccountButton = styled(Flex)`
  background: ${(props) => props.theme.neutral};
  justify-content: center;
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-color: ${(props) => props.theme.grey300Border};
  > div > span:last-child {
    color: ${(props) => props.theme.textContrast};
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
  background: ${(props) => props.theme.neutral};
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)}px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  border-color: ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
`;

const Item = styled(Flex)`
  min-width: 160px;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }
  color: ${(props) => props.theme.textPrimary};

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

function ProfileMenuItem({ onClick }) {
  return (
    <Item onClick={onClick}>
      <Profile />
      <div>Profile</div>
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

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 600) {
      setShow(false);
    }
  }, [windowSize]);

  if (!user) {
    const isLoginPage = router.pathname === "/login";
    return isLoginPage ? null : <LoginButton />;
  }

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
    <Wrapper ref={ref}>
      <AccountButton onClick={() => setShow(!show)}>
        <User user={user} noEvent />
      </AccountButton>
      {show && (
        <Menu>
          {user?.address && <ProfileMenuItem onClick={openUserProfile} />}
          {menu.map((item, index) => (
            <Fragment key={index}>
              <Item onClick={() => handleAccountMenu(item)}>
                {item.icon}
                <div>{item.name}</div>
              </Item>
            </Fragment>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}
