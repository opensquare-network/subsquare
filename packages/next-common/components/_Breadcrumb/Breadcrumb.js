import React from "react";
import styled from "styled-components";
import BreadcrumbItem from "./BreadcrumbItem";
import { p_16_bold } from "../../styles/componentCss";

const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  ${p_16_bold};
  color: ${(p) => p.theme.textPrimary};
`;

const CrumbsWrapper = styled.ul`
  padding-left: 0;
  /* override richTextStyles.scss */
  padding-inline-start: 0 !important;
  display: flex;
  margin: 0;
`;

/**
 * @param {import('./types').BreadcrumbProps} props
 */
function Breadcrumb(props) {
  const { separator = "/", className, items, ...restProps } = props;

  return (
    <Wrapper {...restProps} className={`osn-breadcrumb ${className}`}>
      <CrumbsWrapper>
        {items?.map((item, idx) => (
          <BreadcrumbItem separator={separator} path={item.path} key={idx}>
            {item.content}
          </BreadcrumbItem>
        ))}
      </CrumbsWrapper>
    </Wrapper>
  );
}

export default Breadcrumb;
