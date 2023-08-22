import React from "react";
import styled from "styled-components";
import { p_12_normal } from "next-common/styles/componentCss";
import { TrackColors } from "./colors";
import startCase from "lodash.startcase";
import Link from "next/link";

const Box = styled.div`
  width: 10px;
  height: 10px;

  background: ${(p) => p.color || "var(--textTertiary)"};
  border-radius: 2px;
`;

const TrackName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Name = styled(Link)`
  ${p_12_normal}
  color: var(--textPrimary);
  :hover {
    text-decoration: underline;
  }
`;

const Count = styled.span`
  ${p_12_normal}
  color: var(--textTertiary);
`;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 240px;
`;

export default function TrackList({ trackReferendaCounts }) {
  return (
    <Wrapper>
      {trackReferendaCounts?.map((item, index) => (
        <TrackItem key={index}>
          <TrackName>
            <Box color={TrackColors[item.name]} />
            <Name href={`/referenda/tracks/${item.id}/statistics`}>
              {startCase(item.name)}
            </Name>
            {item.percent > 0 && <Count>{item.count}</Count>}
          </TrackName>
          {item.percent > 0 && (
            <Count>{(item.percent * 100).toFixed(2)}%</Count>
          )}
        </TrackItem>
      ))}
    </Wrapper>
  );
}
