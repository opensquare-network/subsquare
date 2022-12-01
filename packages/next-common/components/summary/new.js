import styled, { css } from "styled-components";
import { p_14_normal, p_20_bold } from "../../styles/componentCss";
import { smcss } from "../../utils/responsive";
import Divider from "../styled/layout/divider";
import Content from "./cardContent";
import { SummaryCard, SummaryTitle } from "./styled";

const Wrapper = styled(SummaryCard)`
  height: auto;
`;

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

const SummaryWrapper = styled.div`
  display: flex;
  gap: 16px;
  ${smcss(css`
    flex-direction: column;
    gap: 16px;
  `)}
`;

const SummaryItem = styled.div`
  flex: 1;
`;

export default function Summary({
  title,
  titleExtra,
  description,
  items = [],
  footer,
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

      {!!items?.length && (
        <>
          <Divider margin={16} />
          <SummaryWrapper>
            {items.map((item, idx) => (
              <SummaryItem key={idx}>
                <SummaryTitle>{item.title}</SummaryTitle>
                <Content>{item.content}</Content>
              </SummaryItem>
            ))}
          </SummaryWrapper>
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
