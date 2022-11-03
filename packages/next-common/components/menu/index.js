import styled, { css } from "styled-components";
import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ExternalLink from "../icons/externalLink";
import Flex from "../styled/flex";
import { p_12_normal } from "../../styles/componentCss";

const Wrapper = styled.div`
  padding-top: 41px;
  padding-bottom: 32px;
  > :not(:first-child) {
    margin-top: 8px;
  }
  a {
    display: block;
  }
`;

const TitleTip = styled.span`
  color: ${(p) => p.theme.textPlaceholder};
  letter-spacing: 0;
  margin-left: 8px;
  ${p_12_normal};
`;

const Title = styled.div`
  height: 36px;
  padding: 12px;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
`;

const ItemInner = styled(Flex)`
  height: inherit;
  width: inherit;
  gap: 8px;
  padding: 0 12px;
`;
const Item = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => props.theme.textSecondary};
  > svg:first-child {
    path {
      fill: ${(props) => props.theme.textSecondary};
    }
  }
  > svg.external-link-icon {
    path {
      stroke: ${(props) => props.theme.textPlaceholder};
    }
  }

  :hover {
    color: ${(props) => props.theme.primaryPurple500};

    > svg {
      &:first-child {
        path {
          fill: ${(props) => props.theme.primaryPurple500};
        }
      }
    }
  }

  > div {
    flex: 1 1 auto;
  }

  > :not(:first-child) {
    margin-left: 8px;
  }

  ${(p) =>
    p.active &&
    css`
      font-weight: 600;
      background: ${(props) => props.theme.grey200Border};
      color: ${(props) => props.theme.primaryPurple500};

      > svg {
        &:first-child path {
          fill: ${(props) => props.theme.primaryPurple500};
        }
      }
    `}
`;

export default function Menu({ menu, chain }) {
  const router = useRouter();

  function defaultItemRender(icon, name) {
    return (
      <ItemInner>
        {icon}
        <span>{name}</span>
      </ItemInner>
    );
  }

  return (
    <Wrapper>
      {menu.map((menu, index) => {
        if (menu?.excludeToChains?.includes(chain)) {
          return null;
        }
        return (
          <div key={index}>
            {menu.name && (
              <Title>
                {menu.name}
                {menu.tip && <TitleTip>{menu.tip}</TitleTip>}
              </Title>
            )}
            {menu.items.map((item, index) => {
              const isExternalLink = (item.pathname || "").startsWith("http");

              if (item?.excludeToChains?.includes(chain)) {
                return null;
              }
              return (
                <Fragment key={index}>
                  <Link href={item?.pathname} passHref>
                    <a target={isExternalLink ? "_blank" : "_self"}>
                      <Item
                        active={
                          router.pathname === item.pathname ||
                          (router.pathname === "/[chain]" &&
                            item.pathname === "/")
                        }
                      >
                        {item.itemRender?.(item.icon, item.name) ??
                          defaultItemRender(item.icon, item.name)}
                        {isExternalLink && <ExternalLink color="#D7DEE8" />}
                      </Item>
                    </a>
                  </Link>
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </Wrapper>
  );
}
