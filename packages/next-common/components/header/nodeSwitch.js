import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useWindowSize from "../../utils/hooks/useWindowSize";
import {
  currentNodeSelector,
  nodesSelector,
} from "../../store/reducers/nodeSlice";
import Caret from "../icons/caret";
import { useChainSettings } from "../../context/chain";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import NodeSignalIcon from "./nodeSignalIcon";
import { useClickAway } from "react-use";

const NodeOptions = dynamicClientOnly(() => import("./nodeOptions"));

const Wrapper = styled.div``;

const SmallSelect = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--neutral100);
  border-width: 1px;
  border-style: solid;
  border-color: var(--neutral400);
  color: var(--textPrimary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > img {
    width: 24px;
    height: 24px;
  }
  &:hover {
    border-color: var(--neutral500);
  }
`;

const Select = styled.div`
  background-color: var(--neutral100);
  border: 1px solid;
  border-color: var(--neutral400);
  color: var(--textPrimary);
  border-radius: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
  }
`;

export default function NodeSwitch({ small }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const chainSettings = useChainSettings();
  const currentNode = useSelector(currentNodeSelector);
  const nodes = useSelector(nodesSelector);
  const [currentNodeSetting, setCurrentNodeSetting] = useState(
    chainSettings.endpoints[0],
  );

  useClickAway(ref, () => setShow(false));

  useEffect(() => {
    if (small && windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [small, windowSize]);

  useEffect(() => {
    const url = currentNode;
    if (url) {
      const nodeSetting = (nodes || []).find((item) => item.url === url);
      setCurrentNodeSetting(nodeSetting);
    }
  }, [currentNode, nodes]);

  if (!currentNodeSetting) {
    return null;
  }

  return (
    <Wrapper className="max-sm:relative" ref={ref}>
      {small && (
        <SmallSelect role="button" onClick={() => setShow(!show)}>
          <NodeSignalIcon delay={currentNodeSetting?.delay} />
        </SmallSelect>
      )}
      {!small && (
        <Select role="button" onClick={() => setShow(!show)}>
          <NodeSignalIcon delay={currentNodeSetting?.delay} />
          <div>{currentNodeSetting?.name}</div>
          <Caret />
        </Select>
      )}
      {show && (
        <NodeOptions
          small={small}
          currentNodeSetting={currentNodeSetting}
          setShow={setShow}
        />
      )}
    </Wrapper>
  );
}
