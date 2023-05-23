import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import Background from "../../styled/backgroundShade";
import ClosePanelIcon from "../../../assets/imgs/icons/close-panel.svg";
import { emptyFunction } from "../../../utils";
import { useScrollLock } from "../../../utils/hooks/useScrollLock";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import { useEscapeKeyOnce } from "next-common/utils/hooks/useEscapeKeyOnce";
import { breakpoint } from "../../../utils/responsive";
import { w_full } from "../../../styles/tailwindcss";

const Wrapper = styled(NeutralPanel)`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  width: 400px;
  ${(p) =>
    p.wide &&
    css`
      @media screen and (min-width: 768px) {
        width: 480px;
      }
    `}
  padding: 24px;
  transform: translate(-50%, -50%);
  color: ${(props) => props.theme.textPrimary};

  ${breakpoint(400, w_full)};

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

let z;
export default function Popup({
  children,
  title,
  onClose = emptyFunction,
  className,
  wide,
  zIndex = 999,
}) {
  const ref = useRef();
  useEscapeKeyOnce(onClose);

  const [, setIsLocked] = useScrollLock();

  useEffect(() => {
    z = zIndex;
    z++;
  }, []);

  useEffect(() => {
    setIsLocked(true);

    return () => setIsLocked(false);
  });

  return (
    <Background zIndex={z} onClick={onClose}>
      <Wrapper
        wide={wide}
        ref={ref}
        className={className}
        onClick={(event) => event.stopPropagation()}
      >
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
