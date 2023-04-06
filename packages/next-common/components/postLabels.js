import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { p_12_normal } from "../styles/componentCss";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  & > :not(:first-child) {
    margin-left: 8px;
  }
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
      {labels.map((item) => (
        <Link
          key={item}
          href={`/discussions?label=${encodeURIComponent(item)}`}
          legacyBehavior>
          <Label>{item}</Label>
        </Link>
      ))}
    </Wrapper>
  );
}
