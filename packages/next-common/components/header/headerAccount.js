import React, { Fragment, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useWindowSize from "../../utils/hooks/useWindowSize.js";
import { logout } from "../../store/reducers/userSlice";
import User from "../user";
import Relative from "../styled/relative";
import Flex from "../styled/flex";
import { shadow_200 } from "../../styles/componentCss";
import LoginButton from "./loginButton";
import { isKeyRegisteredUser } from "../../utils";
import { accountMenu, accountMenuForKeyAccount } from "./consts";
import useDarkMode from "../../utils/hooks/useDarkMode";

const Wrapper = Relative;

const AccountButton = styled(Flex)`
  background: #ffffff;
  justify-content: center;
  border: 1px solid #e0e4eb;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      > div > span:last-child {
        color: #fff;
      }
    `};

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
  left: 50%;
  transform: translate(-50%, 0);
  margin-top: 4px;
  background: #ffffff;
  padding: 8px 0;
  z-index: 999999;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;

      color: #fff;
    `};
`;

const Item = styled(Flex)`
  min-width: 160px;
  color: #506176;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  :hover {
    background: #f6f7fa;
  }
  ${(props) =>
    props?.theme === "dark" &&
    css`
      color: rgba(255, 255, 255, 0.6);
      :hover {
        background: #272a3a;
      }
    `};

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const Divider = styled.div`
  background: #ebeef4;
  height: 1px;
  margin: 8px 0;
`;

export default function HeaderAccount({ user, chain }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const [theme] = useDarkMode();
  const windowSize = useWindowSize();
  const dispatch = useDispatch();

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 600) {
      setShow(false);
    }
  }, [windowSize]);

  if (!user) {
    const isLoginPage = router.pathname === "/login";
    return isLoginPage ? null : <LoginButton chain={chain} />;
  }

  const menu = isKeyRegisteredUser(user)
    ? accountMenuForKeyAccount
    : accountMenu;

  const handleAccountMenu = (item) => {
    if (item.value === "logout") {
      dispatch(logout());
    } else if (item.pathname) {
      router.push(item.pathname);
    }
    setShow(false);
  };

  return (
    <Wrapper ref={ref}>
      <AccountButton onClick={() => setShow(!show)} theme={theme}>
        <User user={user} chain={chain} noEvent />
      </AccountButton>
      {show && (
        <Menu theme={theme}>
          {menu.map((item, index) => (
            <Fragment key={index}>
              {index === menu.length - 1 && <Divider />}
              <Item onClick={() => handleAccountMenu(item)} theme={theme}>
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
