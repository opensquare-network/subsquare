import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
  left: 50%;
  transform: translate(-50%, 0);
  margin-top: 4px;
  padding: 8px 0;
  z-index: 999999;
  background: ${(props) => props.theme.neutral};
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)} px;
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

export default function HeaderAccount({ user, chain }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const ref = useRef();
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
      <AccountButton onClick={() => setShow(!show)}>
        <User user={user} chain={chain} noEvent />
      </AccountButton>
      {show && (
        <Menu>
          {menu.map((item, index) => (
            <Fragment key={index}>
              {index === menu.length - 1 && <Divider margin={8} />}
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
