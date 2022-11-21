import React from "react";
import styled from "styled-components";
import { p_16_bold } from "../../styles/componentCss";

const Item = styled.span`
  a {
    cursor: pointer;

    :hover {
      color: inherit;
      text-decoration: underline;
    }
  }
`;

const Separator = styled.span`
  margin: 0 8px;
  color: ${(p) => p.theme.textPlaceholder};
`;

const Wrapper = styled.li`
  list-style: none;
  ${p_16_bold};

  &:last-child {
    ${Separator} {
      display: none;
    }

    ${Item} {
      color: ${(p) => p.theme.textTertiary};
      pointer-events: none;
      a {
        cursor: unset;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }
`;

/**
 * @param {import('./types').BreadcrumbItemProps} props
 */
function BreadcrumbItem(props) {
  const { children, separator = "/" } = props ?? {};

  if (children) {
    return (
      <Wrapper>
        <Item>{children}</Item>
        {separator && (
          <Separator className="osn-breadcrumb-separator">
            {separator}
          </Separator>
        )}
      </Wrapper>
    );
  }

  return null;
}

export default BreadcrumbItem;
