import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Background from "../../styled/backgroundShade";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";
import ClosePanelIcon from "../../../assets/imgs/icons/close-panel.svg";
import { emptyFunction } from "../../../utils";
import { useScrollLock } from "../../../utils/hooks/useScrollLock";
import { NeutralPanel } from "../../styled/containers/neutralPanel";

const Wrapper = styled(NeutralPanel)`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  width: 400px;
  padding: 24px;
  transform: translate(-50%, -50%);
  color: ${(props) => props.theme.textPrimary};

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 14px;
  line-height: 100%;
  h3 {
    margin: 0;
  }
  > svg {
    cursor: pointer;
  }
`;

export default function Popup({
  children,
  title,
  onClose = emptyFunction,
  className,
}) {
  const ref = useRef();
  useOnClickOutside(ref, () => onClose());

  const [, setIsLocked] = useScrollLock();

  useEffect(() => {
    setIsLocked(true);

    return () => setIsLocked(false);
  });

  return (
    <Background>
      <Wrapper ref={ref} className={className}>
        {title && (
          <TopWrapper>
            <h3>{title}</h3>
            <ClosePanelIcon onClick={onClose} />
          </TopWrapper>
        )}
        {children}
      </Wrapper>
    </Background>
  );
}
