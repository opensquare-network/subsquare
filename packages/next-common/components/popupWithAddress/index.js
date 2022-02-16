import React from "react";
import styled from "styled-components";
import { useRef } from "react";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import ClosePanelIcon from "../../assets/imgs/icons/close-panel.svg";
import NoExtension from "./noExtension";
import Inaccessible from "./inaccessible";
import NoAccounts from "./noAccounts";

const Background = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.24);
  z-index: 999;
  top: 0;
  left: 0;
  margin-top: 0 !important;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  width: 400px;
  padding: 24px;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 22px rgba(30, 33, 52, 0.11),
    0 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 6px;
  color: #1e2134;
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
  > svg {
    cursor: pointer;
  }
`;

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  ...props
}) {
  const ref = useRef();
  useOnClickOutside(ref, () => onClose());

  const [
    extensionAccounts,
    hasExtension,
    isExtensionAccessible,
    extensionDetecting,
  ] = useExtensionAccounts("subsquare");

  if (extensionDetecting) {
    return null;
  }

  let content;

  if (!hasExtension) {
    content = <NoExtension />;
  } else if (!isExtensionAccessible) {
    content = <Inaccessible />;
  } else if (!extensionAccounts || extensionAccounts.length === 0) {
    content = <NoAccounts />;
  } else {
    content = (
      <Component
        onClose={onClose}
        extensionAccounts={extensionAccounts}
        {...props}
      />
    );
  }

  return (
    <Background>
      <Wrapper ref={ref}>
        <TopWrapper>
          <div>{title}</div>
          <ClosePanelIcon onClick={onClose} />
        </TopWrapper>
        {content}
      </Wrapper>
    </Background>
  );
}
