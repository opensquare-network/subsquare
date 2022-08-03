import styled, { css } from "styled-components";
import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ExternalLink from "./icons/externalLink";

const Wrapper = styled.div`
  padding-top: 37px;
  padding-bottom: 32px;
  > :not(:first-child) {
    margin-top: 16px;
  }
  a {
    display: block;
  }
`;

const Title = styled.div`
  padding: 0 12px 12px;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
`;

const Item = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 6px;
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

  return (
    <Wrapper>
      {menu.map((menu, index) => {
        if (menu?.excludeToChains?.includes(chain)) {
          return null;
        }
        return (
          <div key={index}>
            {menu.name && <Title>{menu.name}</Title>}
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
                        {item.icon}
                        <span>{item.name}</span>
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
