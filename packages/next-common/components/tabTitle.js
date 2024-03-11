import React from "react";
import { isNil } from "lodash-es";
import styled from "styled-components";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  div.icon {
    display: flex;
    align-items: center;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  span.num {
    margin-left: 4px;
    color: ${(p) =>
      p.active ? "var(--textSecondary)" : "var(--textTertiary)"};
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
`;

export default function TabTitle({ name, icon = null, num, active }) {
  return (
    <TitleWrapper active={active}>
      <div className="icon">{icon}</div>
      <div>
        {name}
        {!isNil(num) && <span className="num">({num})</span>}
      </div>
    </TitleWrapper>
  );
}
