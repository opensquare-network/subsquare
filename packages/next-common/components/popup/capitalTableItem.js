import React from "react";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import ValueDisplay from "next-common/components/valueDisplay";
import { p_14_normal } from "next-common/styles/componentCss";
import { inline_flex, text_tertiary } from "next-common/styles/tailwindcss";
import styled from "styled-components";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

const Capital = styled.div`
  ${inline_flex};
  ${p_14_normal};
`;
const CapitalConvictionLabel = styled.span`
  width: 60px;
  ${text_tertiary};
`;

export default function CapitalTableItem({ capital, item, tab, conviction }) {
  const chainSettings = useChainSettings();
  const chain = useChain();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;
  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);

  return (
    <Capital>
      <ValueDisplay value={capital} symbol={symbol} showTooltip={false} />
      {hasLabel && (
        <CapitalConvictionLabel>
          <VoteLabel conviction={conviction} {...item} tab={tab} />
        </CapitalConvictionLabel>
      )}
    </Capital>
  );
}
