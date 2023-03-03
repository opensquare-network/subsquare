import React from "react";
import noop from "lodash.noop";
import styled, { css } from "styled-components";
import { useCallback } from "react";
import { p_12_normal } from "../../../styles/componentCss";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Choice = styled.div`
  ${p_12_normal}
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;

  border-radius: 16px;

  cursor: pointer;

  ${(p) =>
    p.selected
      ? css`
          color: ${(p) => p.theme.primaryPurple500};
          border: 1px solid ${(p) => p.theme.primaryPurple500}66;
        `
      : css`
          color: ${(p) => p.theme.textSecondary};
          border: 1px solid ${(p) => p.theme.grey300Border};
          :hover {
            color: ${(p) => p.theme.textPrimary};
            border-color: ${(p) => p.theme.grey400Border};
          }
        `}
`;

export default function LabelSelect({
  allLabels = [],
  maxSelect = 1,
  selected = [],
  setSelected = noop,
}) {
  const selectChoice = useCallback(
    (name) => {
      setSelected((selected) => {
        if (selected.includes(name)) {
          return selected.filter((item) => item !== name);
        }
        return [...selected, name].slice(-maxSelect);
      });
    },
    [maxSelect],
  );

  if (allLabels.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      {allLabels.map((item) => (
        <Choice
          key={item}
          selected={selected?.includes(item)}
          onClick={() => selectChoice(item)}
        >
          {item}
        </Choice>
      ))}
    </Wrapper>
  );
}
