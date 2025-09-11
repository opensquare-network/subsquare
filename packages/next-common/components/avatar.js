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
import { cssSize } from "next-common/utils/cssUtils";

const StyledIdenticon = styled(Identicon)`
  circle:first-child {
    fill: var(--neutral300);
  }
`;

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => cssSize(p.size)};
  height: ${(p) => cssSize(p.size)};
  border-radius: 50%;
  background-color: var(--neutral200);
`;

const ImgWrapper = styled.img`
  width: ${(p) => cssSize(p.size)};
  max-width: ${(p) => cssSize(p.size)};
  height: ${(p) => cssSize(p.size)};
  border-radius: 50%;
`;

export default function Avatar({ address, size = "24px" }) {
  const themeObj = useThemeSetting();
  const theme = "polkadot";
  const addressAvatarMap = useAddressAvatarMap();

  const avatarSize = `calc(${cssSize(size)} / 10 * 9)`;

  const [avatarCid] = useAvatarInfo(address);

  if (avatarCid) {
    return <AvatarImg src={getIpfsLink(avatarCid)} size={size} />;
  }

  const maybeEvmAddress = tryConvertToEvmAddress(address);

  const image = addressAvatarMap?.get(maybeEvmAddress);
  if (image) {
    return (
      <Wrapper size={size}>
        <ImgWrapper size={avatarSize} src={image} alt={maybeEvmAddress} />
      </Wrapper>
    );
  }

  if (isEthereumAddress(maybeEvmAddress)) {
    return (
      <Wrapper size={size}>
        <ImgWrapper
          size={avatarSize}
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
