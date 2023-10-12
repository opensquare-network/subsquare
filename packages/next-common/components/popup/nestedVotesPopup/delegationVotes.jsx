"use client";

import React from "react";
import { useChainSettings } from "next-common/context/chain";
import styled from "styled-components";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import ValueDisplay from "next-common/components/valueDisplay";
import Descriptions from "next-common/components/Descriptions";
import { toPrecision } from "next-common/utils";
import tw from "tailwind-styled-components";

const StyledCapitalSVG = styled(BalanceSVG)`
  stroke: var(--textTertiary);
`;

const StyledDelegatorsSVG = styled(AddressesSVG)`
  stroke: var(--textTertiary);
`;

const StyledTotalDelegationSvg = styled(SupportSVG)`
  stroke: var(--textTertiary);
`;

const DetailDescriptionLabel = tw.div`
  flex items-center gap-x-2
`;

export default function DelegationVotes({ data, delegations }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const delegationItems = [
    {
      label: (
        <DetailDescriptionLabel>
          <StyledTotalDelegationSvg />
          <span>Votes</span>
        </DetailDescriptionLabel>
      ),
      value: delegations?.length ? (
        <ValueDisplay
          value={toPrecision(data.totalDelegatedVotes, chainSettings.decimals)}
          symbol={symbol}
        />
      ) : (
        0
      ),
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledDelegatorsSVG />
          <span>Delegators</span>
        </DetailDescriptionLabel>
      ),
      value: delegations?.length || 0,
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledCapitalSVG />
          <span>Capital</span>
        </DetailDescriptionLabel>
      ),
      value: delegations?.length ? (
        <ValueDisplay
          value={toPrecision(
            data.totalDelegatedCapital,
            chainSettings.decimals,
          )}
          symbol={symbol}
        />
      ) : (
        0
      ),
    },
  ];

  return <Descriptions title="Delegation Votes" items={delegationItems} />;
}
