import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../loading";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import useWindowSize from "../../utils/hooks/useWindowSize";
import ChainIcon from "./chainIcon";
import { ArrowDown } from "@osn/icons/subsquare";
import NetworkOptions from "./networkOptions";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

const Wrapper = styled.div`
  position: relative;
  font-size: 14px;
`;

const Select = styled.div`
  border: 1px solid;
  border-color: var(--neutral400);
  background-color: var(--neutral100);
  border-radius: 8px;
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
      color: var(--textTertiary);
    }
    > :last-child {
      font-weight: 500;
      color: var(--textPrimary);
    }
  }
`;

const NetworkBlock = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  > span {
    margin-left: 4px;
    margin-right: 12px;
    color: var(--textPrimary);
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
  const nodesHeight = useSelector(chainOrScanHeightSelector);

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [windowSize]);

  let heightComponent;
  if (nodesHeight) {
    heightComponent = <span>{`#${nodesHeight?.toLocaleString()}`}</span>;
  } else {
    heightComponent = <Loading size={16} />;
  }

  return (
    <Wrapper ref={ref}>
      <Select onClick={() => setShow(!show)}>
        <ChainIcon chain={activeNode.value} />
        <NetworkBlock>
          {activeNode?.hideHeight ? (
            <div>{activeNode?.name}</div>
          ) : (
            heightComponent
          )}
        </NetworkBlock>
        <ArrowDown className="[&_path]:stroke-textTertiary" />
      </Select>
      {show && <NetworkOptions activeNode={activeNode} setShow={setShow} />}
    </Wrapper>
  );
}
