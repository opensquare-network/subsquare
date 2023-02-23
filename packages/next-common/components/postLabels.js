import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { p_12_normal } from "../styles/componentCss";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Labels = styled.div`
  display: flex;
  gap: 8px;
`;

const Label = styled.a`
  display: flex;
  padding: 2px 8px;
  ${p_12_normal}
  color: ${(p) => p.theme.textSecondary};
  border: 1px solid ${(p) => p.theme.grey300Border};
  border-radius: 10px;
  cursor: pointer;
`;

export default function PostLabels({ labels }) {
  return (
    <Wrapper>
      <Labels>
        {labels.map((item) => (
          <Link
            key={item}
            href={`/discussions?label=${encodeURIComponent(item)}`}
          >
            <Label>{item}</Label>
          </Link>
        ))}
      </Labels>
    </Wrapper>
  );
}
