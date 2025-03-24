import * as React from "react";
import Identicon from "@osn/polkadot-react-identicon";
import styled from "styled-components";
import { useThemeSetting } from "../context/theme";
import makeBlockie from "ethereum-blockies-base64";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useAddressAvatarMap } from "next-common/context/avatar";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { AvatarImg } from "./user/styled";
import { SystemAvatarDefault } from "@osn/icons/subsquare";

const StyledIdenticon = styled(Identicon)`
  circle:first-child {
    fill: var(--neutral300);
  }
`;

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: calc(${(props) => props.size} / 2);
  background-color: var(--neutral200);
`;

const ImgWrapper = styled.img`
  width: ${(props) => props.size};
  max-width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: calc(${(props) => props.size} / 2);
`;

export default function Avatar({ address, size = "24px" }) {
  const themeObj = useThemeSetting();
  const theme = "polkadot";
  const addressAvatarMap = useAddressAvatarMap();

  const [avatarCid] = useAvatarInfo(address);

  if (avatarCid) {
    return <AvatarImg src={getIpfsLink(avatarCid)} size={size} />;
  }

  const maybeEvmAddress = tryConvertToEvmAddress(address);

  const image = addressAvatarMap?.get(maybeEvmAddress);
  if (image) {
    return (
      <Wrapper size={size}>
        <ImgWrapper size={size} src={image} alt={maybeEvmAddress} />
      </Wrapper>
    );
  }

  if (isEthereumAddress(maybeEvmAddress)) {
    return (
      <Wrapper size={size}>
        <ImgWrapper
          size={size}
          src={makeBlockie(maybeEvmAddress)}
          alt={maybeEvmAddress}
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

  return <SystemAvatarDefault width={size} height={size} />;
}
