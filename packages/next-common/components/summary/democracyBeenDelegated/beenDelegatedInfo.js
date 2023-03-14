import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import GreyInfoPanel from "../styled/greyInfoPanel";
import {
  flex_nowrap,
  gap_x,
  inline_flex,
  items_center,
  overflow_x_scroll,
  text_secondary,
  whitespace_nowrap,
} from "../../../styles/tailwindcss";
import { smcss } from "../../../utils/responsive";
import { p_12_normal } from "../../../styles/componentCss";

const Wrapper = styled(GreyInfoPanel)`
  ${flex_nowrap};
  ${whitespace_nowrap};

  ${smcss(overflow_x_scroll)};
`;

const Item = styled.div`
  ${inline_flex};
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

export default function BeenDelegatedInfo({ delegations, addressesCount }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <Wrapper>
      <Item>
        <span>Been delegated</span>
        <ValueDisplay
          value={
            <TextSecondary>
              {toPrecision(delegations?.votes || 0, decimals)}
            </TextSecondary>
          }
          symbol={<TextSecondary>{symbol}</TextSecondary>}
        />
      </Item>
      <Item>
        <span>Capital</span>
        <ValueDisplay
          value={
            <TextSecondary>
              {toPrecision(delegations?.capital || 0, decimals)}
            </TextSecondary>
          }
          symbol={<TextSecondary>{symbol}</TextSecondary>}
        />
      </Item>
      <Item>
        <span>By</span>
        <TextSecondary>
          {addressesCount} {addressesCount === 1 ? "Address" : "Addresses"}
        </TextSecondary>
      </Item>
    </Wrapper>
  );
}
