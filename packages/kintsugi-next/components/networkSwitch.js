import styled, { css } from "styled-components";
import { useState, useRef, useEffect } from "react";
import { nodes } from "next-common/utils/constants";
import { useOnClickOutside, useWindowSize } from "utils/hooks";
import { shadow_200 } from "../styles/componentCss";
import { useSelector } from "react-redux";
import { nodesHeightSelector } from "store/reducers/nodeSlice";
import LoadingSvg from "public/imgs/icons/members-loading.svg";

const Wrapper = styled.div`
  position: relative;
  font-size: 14px;
`;

const Select = styled.div`
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
    display: flex;
    > :first-child {
      color: #9da9bb;
    }
    > :last-child {
      font-weight: 500;
      color: #1e2134;
    }
  }
  > img.logo {
    flex: 0 0 24px;
  }
`;

const Options = styled.div`
  position: absolute;
  background: #ffffff;
  ${shadow_200};
  border-radius: 4px;
  padding: 8px 0;
  width: 100%;
  margin-top: 4px;
  z-index: 999999;
`;

const Item = styled.a`
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-weight: 500;
  cursor: pointer;
  color: #506176;
  :hover {
    background: #f6f7fa;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
  }
  > img.logo {
    flex: 0 0 24px;
  }
  ${(p) =>
    p.active &&
    css`
      color: #1e2134;
      background: #f6f7fa;
    `}
`;

const NetworkBlock = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  > div {
  }
  > span {
    margin-left: 4px;
    margin-right: 12px;
  }
  > svg {
    margin-left: 7px;
    margin-right: 15px;
  }
`;

export default function NetworkSwitch({ activeNode, isWeb3Login }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const nodesHeight = useSelector(nodesHeightSelector);

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [windowSize]);

  return (
    <Wrapper ref={ref}>
      <Select onClick={() => setShow(!show)}>
        <img
          width={24}
          height={24}
          src={`/imgs/icons/${activeNode.icon}`}
          alt=""
          className="logo"
        />
        <NetworkBlock>
          {activeNode?.hideHeight ? (
            <div>{activeNode?.name}</div>
          ) : (
            <>
              <div>Block</div>
              {nodesHeight ? (
                <span>{`#${nodesHeight?.toLocaleString()}`}</span>
              ) : (
                <LoadingSvg />
              )}
            </>
          )}
        </NetworkBlock>
        <img width={14} height={14} src="/imgs/icons/caret-down.svg" alt="" />
      </Select>
      {show && (
        <Options>
          {nodes.map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                setShow(false);
              }}
              active={activeNode.value === nodes[index].value}
              href={
                activeNode.value === item.value
                  ? null
                  : isWeb3Login
                  ? `https://${item.value}.subsquare.io/login`
                  : `https://${item.value}.subsquare.io`
              }
            >
              <img
                width={24}
                height={24}
                src={`/imgs/icons/${item.icon}`}
                alt=""
                className="logo"
              />
              <div>{item.name}</div>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
