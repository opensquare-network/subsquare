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
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Cirtcle = styled.div`
  height: 12px;
  width: 12px;
  border: 3px solid #6848ff;
  border-radius: 50%;
  margin: 4px 0;
`;

const Bar = styled.div`
  width: 2px;
  background-color: #b4a3ff;
  margin: 0 auto;
  flex-grow: 1;
  ${(p) =>
    !p.isFold &&
    css`
      background-color: #ebeef4;
    `}
`;

const Mid = styled.div`
  height: 2px;
  width: 8px;
  margin: 9px 4px 0;
  background-color: #b4a3ff;
`;

const Right = styled.div`
  flex-grow: 1;
`;

export default function FoldableItem({ data }) {
  const [isFold, setIsFold] = useState(true);

  return (
    <Wrapper isFold={isFold}>
      <Left>
        <Cirtcle />
        <Bar className="fold-bar" isFold={isFold} />
      </Left>
      <Mid />
      <Right>
        {data.map((item, index) => (
          <Item
            key={index}
            data={item}
            foldable
            isFold={isFold}
            setIsFold={setIsFold}
          />
        ))}
      </Right>
    </Wrapper>
  );
}
