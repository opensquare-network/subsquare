import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../loading";
import { nodesHeightSelector } from "../../store/reducers/nodeSlice";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import useWindowSize from "../../utils/hooks/useWindowSize";
import ChainIcon from "./chainIcon";
import Caret from "../icons/caret";
import NetworkOptions from "./networkOptions";

const Wrapper = styled.div`
  position: relative;
  font-size: 14px;
`;

const Select = styled.div`
  background: ${(props) => props.theme.textContrast};
  border: 1px solid ${(props) => props.theme.grey300Border};
  background: ${(props) => props.theme.neutral};
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
      color: ${(props) => props.theme.textTertiary};
    }
    > :last-child {
      font-weight: 500;
      color: ${(props) => props.theme.textPrimary};
    }
  }
  > img.logo {
    flex: 0 0 24px;
  }
`;

const NetworkBlock = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  > span {
    margin-left: 4px;
    margin-right: 12px;
    color: ${(props) => props.theme.textPrimary};
  }
  > svg {
    margin-left: 7px;
    margin-right: 15px;
  }
`;

export default function NetworkSwitch({ activeNode }) {
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
        <ChainIcon chain={activeNode.value} />
        <NetworkBlock>
          {activeNode?.hideHeight ? (
            <div>{activeNode?.name}</div>
          ) : (
            <>
              <div>Block</div>
              {nodesHeight ? (
                <span>{`#${nodesHeight?.toLocaleString()}`}</span>
              ) : (
                <Loading size={16} />
              )}
            </>
          )}
        </NetworkBlock>
        <Caret />
      </Select>
      {show && <NetworkOptions activeNode={activeNode} />}
    </Wrapper>
  );
}
