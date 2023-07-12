// https://ant.design/components/descriptions, Display multiple read-only fields in groups.

import React from "react";
import styled from "styled-components";
import {
  flex,
  items_center,
  justify_between,
  w_full,
} from "next-common/styles/tailwindcss";
import {
  p_14_bold,
  p_14_medium,
  p_14_normal,
} from "next-common/styles/componentCss";

const Wrapper = styled.div`
  ${w_full};
`;
const DescriptionsTitle = styled.h3`
  margin: 0;
  margin-bottom: 8px;
  ${p_14_bold};
  color: var(--textPrimary);
`;
const DescriptionItem = styled.div`
  height: 44px;
  ${flex};
  ${justify_between};
  ${items_center};
  color: var(--textPrimary);

  & + & {
    border-top: 1px solid var(--neutral300);
  }
`;
const DescriptionItemLabel = styled.div`
  ${p_14_medium};
`;
const DescriptionItemValue = styled.div`
  ${p_14_normal};
`;

export default function Descriptions({ title = "", items = [] }) {
  return (
    <Wrapper>
      {title && <DescriptionsTitle>{title}</DescriptionsTitle>}

      {items?.length &&
        items.map((item, idx) => (
          <DescriptionItem key={idx}>
            <DescriptionItemLabel>{item.label}</DescriptionItemLabel>
            <DescriptionItemValue>{item.value}</DescriptionItemValue>
          </DescriptionItem>
        ))}
    </Wrapper>
  );
}
