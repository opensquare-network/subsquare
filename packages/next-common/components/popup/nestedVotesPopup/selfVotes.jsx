"use client";

import React from "react";
import { useChainSettings } from "next-common/context/chain";
import styled from "styled-components";
import AccountSVG from "next-common/assets/imgs/icons/account.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import ConvictionSVG from "next-common/assets/imgs/icons/conviction.svg";
import ValueDisplay from "next-common/components/valueDisplay";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import Descriptions from "next-common/components/Descriptions";
import { toPrecision } from "next-common/utils";
import tw from "tailwind-styled-components";

const StyledAccountSVG = styled(AccountSVG)`
  fill: var(--textTertiary);
`;

const StyledConvictionSVG = styled(ConvictionSVG)`
  stroke: var(--textTertiary);
`;

const StyledCapitalSVG = styled(BalanceSVG)`
  stroke: var(--textTertiary);
`;

const DetailDescriptionLabel = tw.div`
  flex items-center gap-x-2
`;

const DetailSelfVotesAnnotation = styled.span`
  color: var(--textTertiary);
`;

function getAnnotation(data = {}) {
  const { isDelegating, isSplit, isSplitAbstain } = data;

  if (isDelegating) {
    return "Delegating";
  } else if (isSplit) {
    return "Split";
  } else if (isSplitAbstain) {
    return "SplitAbstain";
  }
}

export default function SelfVotes({ data }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;
  const annotation = getAnnotation(data);

  const selfVotesItems = [
    {
      label: (
        <DetailDescriptionLabel>
          <StyledAccountSVG />
          <span>
            Votes
            {annotation && (
              <DetailSelfVotesAnnotation>
                /{annotation}
              </DetailSelfVotesAnnotation>
            )}
          </span>
        </DetailDescriptionLabel>
      ),
      value: (
        <ValueDisplay
          value={toPrecision(data.votes, chainSettings.decimals)}
          symbol={symbol}
        />
      ),
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledConvictionSVG />
          <span>Conviction</span>
        </DetailDescriptionLabel>
      ),
      value: <VoteLabel {...data} />,
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledCapitalSVG />
          <span>Capital</span>
        </DetailDescriptionLabel>
      ),
      value: (
        <ValueDisplay
          value={toPrecision(data.balance, chainSettings.decimals)}
          symbol={symbol}
        />
      ),
    },
  ];

  return <Descriptions title="Self Votes" items={selfVotesItems} />;
}
