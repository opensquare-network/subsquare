import styled from "styled-components";
import { useState, useRef, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Button from "components/button";
import { accountMenu } from "utils/constants";
import { useOnClickOutside, useWindowSize } from "utils/hooks";
import { logout } from "store/reducers/userSlice";
import User from "components/user";
import Relative from "../styled/relative";
import Flex from "../styled/flex";
import { shadow_200 } from "../../styles/componentCss";

const Wrapper = Relative;

const AccountButton = styled(Flex)`
  justify-content: center;
  border: 1px solid #e0e4eb;
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
`;

const Item = styled(Flex)`
  min-width: 160px;
  color: #506176;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  font-size: 14px;
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
      {user && (
        <Wrapper ref={ref}>
          <AccountButton onClick={() => setShow(!show)}>
            <User user={user} chain={chain} noEvent />
          </AccountButton>
          {show && (
            <Menu>
              {accountMenu.map((item, index) => (
                <Fragment key={index}>
                  {index === accountMenu.length - 1 && <Divider />}
                  <Item onClick={() => handleAccountMenu(item)}>
                    <img src={`/imgs/icons/${item.icon}`} alt=""  width={24} height={24}  />
                    <div>{item.name}</div>
                  </Item>
                </Fragment>
              ))}
            </Menu>
          )}
        </Wrapper>
      )}
      {!user && (
        <Button secondary onClick={() => router.push("/login")}>
          Login
        </Button>
      )}
    </>
  );
}
