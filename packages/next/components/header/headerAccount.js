import styled from "styled-components";
import { useState, useRef, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import Button from "components/button";
import { accountMenu } from "utils/constants";
import { useOnClickOutside, useWindowSize } from "utils/hooks";
import { logout } from "store/reducers/userSlice";

const Wrapper = styled.div`
  position: relative;
`;

const AccountButton = styled.div`
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Menu = styled.div`
  box-shadow: 0px 6px 22px rgba(30, 33, 52, 0.11),
    0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 4px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  background: #ffffff;
  padding: 8px 0;
`;

const Item = styled.div`
  min-width: 160px;
  display: flex;
  align-items: center;
  color: #506176;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  :hover {
    background: #f6f7fa;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
  > img {
    flex: 0 0 24px;
    filter: invert(34%) sepia(48%) saturate(275%) hue-rotate(174deg)
      brightness(93%) contrast(85%);
  }
`;

const Divider = styled.div`
  background: #ebeef4;
  height: 1px;
  margin: 8px 0;
`;

export default function HeaderAccount({ user }) {
  const router = useRouter();
  const [login, setLogin] = useState(false);
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

  useEffect(() => {
    setLogin(!!user);
  }, [user]);

  const handleAccountMenu = (item) => {
    if (item.value === "logout") {
      dispatch(logout());
    } else if (item.pathname) {
      router.push(item.pathname);
    }
    setShow(false);
  };

  return (
    <>
      {login && (
        <Wrapper ref={ref}>
          <AccountButton onClick={() => setShow(!show)}>
            <img src="/imgs/icons/avatar.svg" alt="" />
          </AccountButton>
          {show && (
            <Menu>
              {accountMenu.map((item, index) => (
                <Fragment key={index}>
                  {index === accountMenu.length - 1 && <Divider />}
                  <Item onClick={() => handleAccountMenu(item)}>
                    <img src={`/imgs/icons/${item.icon}`} alt="" />
                    <div>{item.name}</div>
                  </Item>
                </Fragment>
              ))}
            </Menu>
          )}
        </Wrapper>
      )}
      {!login && (
        <Button secondary onClick={() => router.push("/login")}>
          Login
        </Button>
      )}
    </>
  );
}
