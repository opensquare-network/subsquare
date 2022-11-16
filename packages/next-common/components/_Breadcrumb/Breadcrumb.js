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

function defaultItemRender(route, _routeIndex, _routes, isLast) {
  return isLast ? (
    <span>{route.name}</span>
  ) : (
    <a href={`#/${getRouteLink(route.link)}`}>{route.name}</a>
  );
}

function getRouteLink(link) {
  link = link.replace(/^\//, "");
  return link;
}

/**
 * @param {import('./types').BreadcrumbProps} props
 */
function Breadcrumb(props) {
  const {
    children,
    routes,
    separator = "/",
    itemRender = defaultItemRender,
    ...rest
  } = props;

  let crumbs;
  if (routes && routes.length > 0) {
    crumbs = routes.map((route, index) => {
      const isLast = routes.indexOf(route) === routes.length - 1;

      return (
        <BreadcrumbItem
          key={route.link || index}
          disabled={isLast}
          separator={separator}
        >
          {itemRender(route, index, routes, isLast)}
        </BreadcrumbItem>
      );
    });
  } else if (children) {
    crumbs = React.Children.toArray(children).map(
      (element, index, elements) => {
        if (!element) {
          return element;
        }

        const isLast = index === elements.length - 1;

        const crumb = React.cloneElement(element, {
          separator,
          disabled: isLast,
          key: index,
        });

        return crumb;
      }
    );
  }

  return (
    <Wrapper {...rest} className="breadcrumb">
      <CrumbsWrapper>{crumbs}</CrumbsWrapper>
    </Wrapper>
  );
}

Breadcrumb.Item = BreadcrumbItem;

export default Breadcrumb;
