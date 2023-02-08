import React from "react";
import VStack from "../styled/vStack";
import { BackgroundButton } from "../buttons/styled";
import styled, { css } from "styled-components";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { p_14_bold, p_14_normal } from "../../styles/componentCss";
import ClosePanelIconOrigin from "../icons/closePanel";
import { useEffect, useState } from "react";
import Flex from "../styled/flex";
import OutWrapperOrigin from "../styled/outWrapper";
import { pageMaxWidth } from "../../utils/constants";
import { smcss } from "../../utils/responsive";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import { useScrollbarWidth } from "../../utils/hooks/useScrollbarWidth";
import { useAcceptCookies } from "../../utils/hooks/useAcceptCookies";

const OutWrapper = styled(OutWrapperOrigin)`
  z-index: 999;
  position: fixed;
  bottom: 32px;
  ${(p) => css`
    right: max(
      calc(((100vw - ${pageMaxWidth}px) / 2) - ${p.scrollbarWidth / 2}px),
      32px
    );
  `}

  ${smcss(css`
    right: 16px;
    left: 16px;
  `)}
`;

const Wrapper = styled(NeutralPanel)`
  margin-left: auto;
  width: 320px;
  border-radius: 8px;
  padding: 24px;

  ${smcss(css`
    width: 100%;
  `)}
`;

const Button = styled(BackgroundButton)`
  background-color: ${(p) => p.theme.primaryDarkBlue};
`;
const ButtonWrapper = styled(Flex)`
  justify-content: flex-end;
`;

const Title = styled.h3`
  color: ${(p) => p.theme.textPrimary};
  margin: 0;
  ${p_14_bold};
`;

const ClosePanelIcon = styled(ClosePanelIconOrigin)`
  &:hover {
    cursor: pointer;
  }
`;

const Description = styled.p`
  color: ${(p) => p.theme.textSecondary};
  margin: 0;
  ${p_14_normal};
`;

export default function CookiesConsent() {
  const [show, setShow] = useState(false);
  const [isAcceptCookies, setIsAcceptCookies] = useAcceptCookies();
  useEffect(() => {
    setShow(!isAcceptCookies);
  }, [isAcceptCookies]);

  const scrollbarWidth = useScrollbarWidth();

  function handleAccept() {
    setIsAcceptCookies(true, { expires: 30 });
    handleClose();
  }
  function handleClose() {
    setShow(false);
  }

  if (!show) {
    return null;
  }

  return (
    <OutWrapper scrollbarWidth={scrollbarWidth}>
      <Wrapper>
        <VStack space={16}>
          <VStack space={8}>
            <FlexBetweenCenter>
              <Title>We Use Cookies!</Title>
              <ClosePanelIcon role="button" onClick={handleClose} />
            </FlexBetweenCenter>

            <Description>
              We use cookies to improve your experience on our site.
            </Description>
          </VStack>

          <ButtonWrapper>
            <Button onClick={handleAccept}>Got it</Button>
          </ButtonWrapper>
        </VStack>
      </Wrapper>
    </OutWrapper>
  );
}
