import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/allVotesPopup/voteLabel";
import ValueDisplay from "next-common/components/valueDisplay";
import User from "next-common/components/user";
import { Conviction, ConvictionSupport } from "../../../utils/referendumCommon";
import GreyInfoPanel from "../styled/greyInfoPanel";
import {
  flex,
  flex_nowrap,
  gap_x,
  items_center,
  overflow_x_scroll,
  text_secondary,
  whitespace_nowrap,
} from "../../../styles/tailwindcss";
import { p_12_normal } from "../../../styles/componentCss";
import { smcss } from "../../../utils/responsive";

const Wrapper = styled(GreyInfoPanel)`
  ${flex_nowrap};
  ${whitespace_nowrap};

  ${smcss(overflow_x_scroll)};
`;

const Item = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(8)};
  ${p_12_normal};

  &:not(:first-child) {
    &::before {
      content: "·";
    }
  }
`;

const TextSecondary = styled.span`
  ${text_secondary};
`;

export default function DemocracySummaryDelegationInfo({ delegating }) {
  const node = useChainSettings();
  if (!delegating) {
    return <div />;
  }

  const conviction = Conviction[delegating.conviction];

  return (
    <Wrapper>
      <Item>
        <span>Delegating to</span>
        <User add={delegating.target} fontSize="inherit" />
        <ValueDisplay
          value={
            <TextSecondary>
              {toPrecision(
                delegating.balance * ConvictionSupport[delegating.conviction],
                node.decimals,
              )}
            </TextSecondary>
          }
          symbol={<TextSecondary>{node.symbol}</TextSecondary>}
        />
      </Item>

      <Item>
        <span>Conviction</span>
        <TextSecondary>
          <VoteLabel conviction={conviction} />
        </TextSecondary>
      </Item>

      <Item>
        <span>Capital</span>
        <ValueDisplay
          value={
            <TextSecondary>
              {toPrecision(delegating.balance, node.decimals)}
            </TextSecondary>
          }
          symbol={<TextSecondary>{node.symbol}</TextSecondary>}
        />
      </Item>
    </Wrapper>
  );
}
