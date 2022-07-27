import React from "react";
import styled from "styled-components";
import { useRef } from "react";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import ClosePanelIcon from "../../assets/imgs/icons/close-panel.svg";
import NoExtension from "./noExtension";
import Inaccessible from "./inaccessible";
import NoAccounts from "./noAccounts";
import Background from "../styled/backgroundShade";

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  width: 400px;
  padding: 24px;
  transform: translate(-50%, -50%);
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  box-shadow: ${(props) => props.theme.shadow200};
  border-radius: 6px;
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
