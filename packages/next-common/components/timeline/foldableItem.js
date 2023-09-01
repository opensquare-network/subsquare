import React from "react";
import styled, { css } from "styled-components";
import { useState } from "react";

import Item from "./item";

const Wrapper = styled.div`
  display: flex;

  ${(p) =>
    p.isFold &&
    css`
      :last-child {
        .fold-bar {
          display: none;
        }
      }
    `}
  ${(p) =>
    !p.indent &&
    css`
      :not(:last-child) {
        .bar {
          display: block !important;
        }
      }
    `}
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Circle = styled.div`
  height: 12px;
  width: 12px;
  border: 3px solid var(--theme500);
  border-radius: 50%;
  margin: 4px 0;
`;

const Bar = styled.div`
  width: 2px;
  background-color: var(--theme300);
  margin: 0 auto;
  flex-grow: 1;
  ${(p) =>
    !p.isFold &&
    css`
      background-color: var(--neutral300);
    `}
`;

const Mid = styled.div`
  height: 2px;
  width: 8px;
  margin: 9px 4px 0;
  background-color: var(--theme300);
`;

const Right = styled.div`
  flex-grow: 1;
`;

export default function FoldableItem({ data, indent = true, compact }) {
  const [isFold, setIsFold] = useState(true);

  return (
    <Wrapper isFold={isFold} indent={indent}>
      {indent && (
        <>
          <Left>
            <Circle />
            <Bar className="fold-bar" isFold={isFold} />
          </Left>
          <Mid />
        </>
      )}
      <Right>
        {data.map((item, index) => (
          <Item
            key={index}
            data={item}
            foldable={data?.length > 1}
            isFold={isFold}
            setIsFold={setIsFold}
            compact={compact}
            className="[&_.timeline-item-right]:!pb-4"
          />
        ))}
      </Right>
    </Wrapper>
  );
}
