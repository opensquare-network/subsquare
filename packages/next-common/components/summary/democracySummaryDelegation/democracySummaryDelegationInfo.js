import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/allVotesPopup/voteLabel";
import ValueDisplay from "next-common/components/valueDisplay";
import User from "next-common/components/user";
import { Conviction, ConvictionSupport } from "../../../utils/referendumCommon";
import GreyInfoPanel from "../styled/greyInfoPanel";
import { flex, gap_x, hidden, items_center, text_secondary } from "../../../styles/tailwindcss";
import { p_12_normal } from "../../../styles/componentCss";
import { smcss } from "../../../utils/responsive";

const Wrapper = styled(GreyInfoPanel)``;

const Item = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(8)};
  ${p_12_normal};

  &:not(:first-child) {
    &::before {
      content: '·';
    }
  }
`;

const TextSecondary = styled.span`
  ${text_secondary};
`;

const ValueDisplayWrapper = styled.span`
  ${smcss(hidden)};
`;
const DelegatingItem = styled(Item)`
  ${ValueDisplay} {
    ${smcss(hidden)};
  }
`;

const CapitalItem = styled(Item)`
  ${smcss(hidden)};
`;

const ConvictionItem = styled(Item)`
  *:first-child {
    ${smcss(hidden)};
  }
`;

export default function DemocracySummaryDelegationInfo({ delegating }) {
  const node = useChainSettings();
  if (!delegating) {
    return <div />;
  }

  const conviction = Conviction[delegating.conviction];

  return (
    <Wrapper>
      <DelegatingItem>
        <span>Delegating to</span>
      <User add={delegating.target} fontSize="inherit" />
        <ValueDisplayWrapper>

      <ValueDisplay
        value={<TextSecondary>{toPrecision(
          delegating.balance * ConvictionSupport[delegating.conviction],
          node.decimals,
        )}</TextSecondary>}
        symbol={<TextSecondary>{node.symbol}</TextSecondary>}
      />
        </ValueDisplayWrapper>
      </DelegatingItem>
      <ConvictionItem>
        <span>Conviction</span>
        <TextSecondary>
          <VoteLabel conviction={conviction} />
        </TextSecondary>
      </ConvictionItem>
      <CapitalItem>
        <span>Capital</span>
        <ValueDisplay
          value={<TextSecondary>{toPrecision(delegating.balance, node.decimals)}</TextSecondary>}
        symbol={<TextSecondary>{node.symbol}</TextSecondary>}
        />
      </CapitalItem>
    </Wrapper>
  );
}
