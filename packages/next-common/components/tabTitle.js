import React from "react";
import isNil from "lodash.isnil";
import styled from "styled-components";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  span.num {
    margin-left: 4px;
    color: ${(p) => (p.active ? p.theme.textSecondary : p.theme.textTertiary)};
  }
`;

export default function TabTitle({ name, icon = null, num, active }) {
  return (
    <TitleWrapper active={active}>
      {icon}
      <div>
        {name}
        {!isNil(num) && <span className="num">({num})</span>}
      </div>
    </TitleWrapper>
  );
}
