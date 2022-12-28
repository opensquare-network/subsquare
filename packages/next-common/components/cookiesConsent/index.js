import VStack from "../styled/vStack";
import { BackgroundButton } from "../buttons/styled";
import styled from "styled-components";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { p_14_bold, p_14_normal } from "../../styles/componentCss";
import ClosePanelIconOrigin from "../icons/closePanel";
import { useEffect, useState } from "react";
import Flex from "../styled/flex";
import OutWrapperOrigin from "../styled/outWrapper";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";
import { CACHE_KEY } from "../../utils/constants";

const OutWrapper = styled(OutWrapperOrigin)`
  position: fixed;
  bottom: 32px;
  right: 0;
  left: 0;
`;

const Wrapper = styled.div`
  margin-left: auto;
  width: 320px;
  background-color: ${(p) => p.theme.neutral};
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.grey200Border};
  box-shadow: ${(p) => p.theme.shadow200};
  padding: 24px;
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
  useEffect(() => {
    const isAcceptCookies = JSON.parse(
      getCookie(CACHE_KEY.acceptCookies) ?? "false"
    );

    setShow(!isAcceptCookies);
  }, []);

  function handleGotIt() {
    setCookie(CACHE_KEY.acceptCookies, true);
    handleClose();
  }
  function handleClose() {
    setShow(false);
  }

  if (!show) {
    return null;
  }

  return (
    <OutWrapper>
      <Wrapper>
        <VStack space={16}>
          <VStack space={8}>
            <FlexBetweenCenter>
              <Title>We Use Cookies!</Title>
              <ClosePanelIcon role="button" onClick={handleClose} />
            </FlexBetweenCenter>

            <Description>
              We uses cookies to gather information about the way users interact
              with website ensure users can get best experience while navigate
              through the website.
            </Description>
          </VStack>

          <ButtonWrapper>
            <Button onClick={handleGotIt}>Got it</Button>
          </ButtonWrapper>
        </VStack>
      </Wrapper>
    </OutWrapper>
  );
}
