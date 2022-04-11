import React, { memo } from "react";
import Link from "next/link";
import styled from "styled-components";
import Chains from "../../../utils/consts/chains";
import useWindowSize from "../../../utils/hooks/useWindowSize";

const ImageLinkWrapper = styled.a`
  height: 63px;
`;

const Logo = styled.img`
  cursor: pointer;
`;

const LogoImg = styled(Logo)`
  width: 161px;
  height: 64px;
`;

function ChainLogo({ chain }) {
  let logo = <LogoImg src="/imgs/logo.svg" alt="" />;
  const { width } = useWindowSize();

  if (width > 768) {
    if (Chains.kintsugi === chain) {
      logo = <Logo src="/imgs/logos/kintsugi.svg" alt={chain} />;
    } else if (Chains.interlay === chain) {
      logo = <Logo src="/imgs/logos/interlay.svg" alt={chain} />;
    } else if (Chains.acala === chain) {
      logo = <Logo src="/imgs/logos/acala.svg" alt={chain} />;
    } else if (Chains.karura === chain) {
      logo = <Logo src="/imgs/logos/karura.svg" alt={chain} />;
    } else if (Chains.khala === chain) {
      logo = <Logo src="/imgs/logos/khala.svg" alt={chain} />;
    } else if (Chains.bifrost === chain) {
      logo = <Logo src="/imgs/logos/bifrost.svg" alt={chain} />;
    } else if (Chains.crust === chain) {
      logo = <Logo src="/imgs/logos/crust.svg" alt={chain} />;
    }
  }

  return (
    <Link href="/">
      <ImageLinkWrapper>{logo}</ImageLinkWrapper>
    </Link>
  );
}

export default memo(ChainLogo);
