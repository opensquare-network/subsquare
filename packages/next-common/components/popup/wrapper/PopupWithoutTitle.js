import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Background from "../../styled/backgroundShade";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";
import { emptyFunction } from "../../../utils";
import { useScrollLock } from "../../../utils/hooks/useScrollLock";
import { NeutralPanel } from "../../styled/containers/neutralPanel";

const Wrapper = styled(NeutralPanel)`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  width: 400px;
  padding: 48px;
  transform: translate(-50%, -50%);
`;

export default function PopupWithoutTitle({
  children,
  onClose = emptyFunction,
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
      <Wrapper ref={ref}>{children}</Wrapper>
    </Background>
  );
}
