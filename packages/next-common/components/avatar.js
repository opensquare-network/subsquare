import * as React from "react";
import Identicon from "@osn/polkadot-react-identicon";
import styled from "styled-components";
import { useThemeSetting } from "../context/theme";
import makeBlockie from "ethereum-blockies-base64";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";

const StyledIdenticon = styled(Identicon)`
  circle:first-child {
    fill: var(--neutral300);
  }
`;

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  background: var(--neutral200);
`;

const ImgWrapper = styled.img`
  border-radius: ${(props) => props.size / 2}px;
`;

export default function Avatar({ address, size = 24 }) {
  const themeObj = useThemeSetting();
  const theme = "polkadot";

  if (isEthereumAddress(address)) {
    const imgSize = (size / 10) * 8;

    return (
      <Wrapper size={size}>
        <ImgWrapper
          size={imgSize}
          src={makeBlockie(address)}
          width={imgSize}
          height={imgSize}
          alt={address}
        />
      </Wrapper>
    );
  }

  if (isPolkadotAddress(address)) {
    return (
      <StyledIdenticon
        value={address}
        size={size}
        theme={theme}
        themeObj={themeObj}
      />
    );
  }

  return null;
}
