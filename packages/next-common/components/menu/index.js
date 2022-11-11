import styled, { css } from "styled-components";
import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ExternalLink from "../icons/externalLink";
import Flex from "../styled/flex";
import { p_12_bold, p_12_medium, p_12_normal } from "../../styles/componentCss";
import { useChain } from "../../context/chain";
import { useState } from "react";
import MenuUnFoldIcon from "../icons/menuUnFold";
import MenuFoldIcon from "../icons/menuFold";

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
  color: ${(props) => props.theme.textTertiary};
  letter-spacing: 2px;
  ${p_12_bold};
`;
const TitleGroup = styled(Flex)`
  gap: 8px;
  padding: 12px 0;
`;

const ItemCount = styled.span`
  margin-left: 8px;
  color: ${(p) => p.theme.textTertiary};
  ${p_12_medium};
`;
const ItemInner = styled(Flex)`
  height: inherit;
  width: inherit;
  gap: 8px;
  padding: 10px 18px;
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

      svg {
        &:first-child path {
          fill: ${(props) => props.theme.primaryPurple500};
        }
      }
    `}
`;
const FoldableButton = styled.button`
  background: none;
  border: none;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 0;
`;

function defaultItemRender(icon, name, count) {
  return (
    <ItemInner>
      {icon}
      <span>
        {name}
        {!!count && <ItemCount>{count}</ItemCount>}
      </span>
    </ItemInner>
  );
}

function MenuGroup({ menu, defaultFold = false }) {
  const chain = useChain();
  const router = useRouter();

  const [folded, setFolded] = useState(defaultFold);

  return (
    <div>
      {menu.name && (
        <TitleGroup>
          <FoldableButton onClick={() => setFolded(!folded)}>
            {folded ? <MenuFoldIcon /> : <MenuUnFoldIcon />}
          </FoldableButton>

          <Title>
            {menu.name}
            {menu.tip && <TitleTip>{menu.tip}</TitleTip>}
          </Title>
        </TitleGroup>
      )}

      <div style={{ display: folded ? "none" : "block" }}>
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
                      router.asPath === item.pathname ||
                      (router.pathname === "/[chain]" && item.pathname === "/")
                    }
                  >
                    {item.itemRender?.(item.icon, item.name, item.count) ??
                      defaultItemRender(item.icon, item.name, item.count)}
                    {isExternalLink && <ExternalLink color="#D7DEE8" />}
                  </Item>
                </a>
              </Link>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function Menu({ menu }) {
  const chain = useChain();

  return (
    <Wrapper>
      {menu.map((menu, index) => {
        if (menu?.excludeToChains?.includes(chain)) {
          return null;
        }

        return <MenuGroup key={index} menu={menu} />;
      })}
    </Wrapper>
  );
}
