import React from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const Title = styled.div``;

const Body = styled.div``;

const Label = styled.span``;

const Value = styled.span``;

export default function MyTooltip({ context }) {
  const { chart, tooltip } = context;

  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    return (
      <Wrapper>
        {titleLines.map((title, i) => (
          <Title key={i}>{title}</Title>
        ))}
        {bodyLines.map((body, i) => {
          const dataset = chart.data.datasets[i];
          const label = dataset.label || "";
          const backgroundColor = dataset.backgroundColor;
          const value = body[0].split(": ")[1];

          return (
            <Body key={i}>
              <Label style={{ backgroundColor }}></Label>
              <Value>
                {label}: {value}
              </Value>
            </Body>
          );
        })}
      </Wrapper>
    );
  }

  return <Wrapper />;
}
