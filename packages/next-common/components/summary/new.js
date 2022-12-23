import React from "react";
import styled from "styled-components";
import { p_14_normal, p_20_bold } from "../../styles/componentCss";
import Divider from "../styled/layout/divider";
import { SummaryCard } from "./styled";

const Wrapper = SummaryCard;

const TitleGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  color: ${(p) => p.theme.textPrimary};
  ${p_20_bold};
`;

const TitleExtra = styled.span`
  color: ${(p) => p.theme.textPlaceholder};
  ${p_20_bold};
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  color: ${(p) => p.theme.textTertiary};
  ${p_14_normal};
`;

export default function Summary({
  title,
  titleExtra,
  description,
  footer,
  children,
}) {
  return (
    <Wrapper>
      {title && (
        <>
          <TitleGroup>
            <Title>{title}</Title>
            {titleExtra && <TitleExtra>{titleExtra}</TitleExtra>}
          </TitleGroup>
        </>
      )}

      {description && <Description>{description}</Description>}

      {children && (
        <>
          <Divider margin={16} />
          {children}
        </>
      )}

      {footer && (
        <>
          <Divider margin={16} />
          {footer}
        </>
      )}
    </Wrapper>
  );
}
