import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import GreyInfoPanel from "../styled/greyInfoPanel";
import {
  flex,
  gap_x,
  hidden,
  items_center,
  text_secondary,
} from "../../../styles/tailwindcss";
import { smcss } from "../../../utils/responsive";
import { p_12_normal } from "../../../styles/componentCss";

const Wrapper = styled(GreyInfoPanel)``;

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

const CapitalItem = styled(Item)`
  ${smcss(hidden)};
`;

const ByItem = styled(Item)`
  ${smcss(hidden)};
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
      <CapitalItem>
        <span>Capital</span>
        <ValueDisplay
          value={
            <TextSecondary>
              {toPrecision(delegations?.capital || 0, decimals)}
            </TextSecondary>
          }
          symbol={<TextSecondary>{symbol}</TextSecondary>}
        />
      </CapitalItem>
      <ByItem>
        <span>By</span>
        <TextSecondary>
          {addressesCount} {addressesCount === 1 ? "Address" : "Addresses"}
        </TextSecondary>
      </ByItem>
    </Wrapper>
  );
}
