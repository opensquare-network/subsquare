import React from "react";
import styled from "styled-components";
import { p_16_bold } from "../../styles/componentCss";
import Link from "next/link";

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
  color: var(--textDisabled);
`;

const Wrapper = styled.li`
  list-style: none;
  ${p_16_bold};

  &:last-child {
    ${Separator} {
      display: none;
    }

    ${Item} {
      color: var(--textTertiary);
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
  const { children, separator = "/", path } = props ?? {};

  let content = children;
  if (path) {
    content = <Link href={path} legacyBehavior>{content}</Link>;
  }

  if (children) {
    return (
      <Wrapper>
        <Item>{content}</Item>
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
