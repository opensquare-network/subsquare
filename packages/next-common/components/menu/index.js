import styled, { css } from "styled-components";
import React, { Fragment, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ExternalLink from "../icons/externalLink";
import Flex from "../styled/flex";
import { p_12_bold, p_12_medium } from "../../styles/componentCss";
import { useChain } from "../../context/chain";
import MenuUnFoldIcon from "../icons/menuUnFold";
import MenuFoldIcon from "../icons/menuFold";
import {
  updateHomeExpandedMenus,
  useHomeExpandedMenus,
  useSettingsDispatch,
} from "../../context/settings";
import MenuCMDKButton from "../menu/menuCMDKButton";
import {
  cursor_pointer,
  inline_flex,
  items_center,
  m_r,
  space_y,
  text_secondary,
  text_tertiary,
  theme,
} from "../../styles/tailwindcss";
import { getHomeMenuGroupDefaultBehaviorByCounts } from "../../utils/consts/menu";
import isNil from "lodash.isnil";

const Wrapper = styled.div`
  padding-top: 41px;
  padding-bottom: 32px;
`;

const MenuWrapper = styled.div`
  ${space_y(8)};
  a {
    display: block;
  }
`;

const TitleActiveCount = styled.span`
  letter-spacing: 0;
  margin-left: 4px;
  &::before {
    content: "·";
    margin-right: 4px;
  }
`;

const Title = styled.div`
  letter-spacing: 0.16em;
  ${p_12_bold};
`;
const TitleGroup = styled(Flex)`
  padding: 12px 0;
  ${cursor_pointer};
  ${text_tertiary};

  &:hover {
    ${text_secondary};
  }

  ${MenuFoldIcon},
  ${MenuUnFoldIcon} {
    path {
      stroke: ${theme("textTertiary")};
    }
  }
  &:hover {
    ${MenuFoldIcon},
    ${MenuUnFoldIcon} {
      path {
        stroke: ${theme("textSecondary")};
      }
    }
  }
`;

const ItemActiveCount = styled.span`
  margin-left: 8px;
  color: var(--textTertiary);
  ${p_12_medium};
`;
const ItemInner = styled(Flex)`
  height: inherit;
  width: inherit;
  padding: 10px 18px;
  & > :not(:last-child) {
    margin-right: 8px;
  }
`;
const Item = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  color: var(--textSecondary);
  > svg:first-child {
    path {
      fill: var(--textSecondary);
    }
  }
  > svg.external-link-icon {
    path {
      stroke: var(--textDisabled);
    }
  }

  :hover {
    color: var(--purple500);

    svg {
      &:first-child {
        path {
          fill: var(--purple500);
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
      background: var(--neutral300);
      color: var(--purple500);

      svg {
        &:first-child path {
          fill: var(--purple500);
        }
      }
    `}
`;

const ItemGroup = styled.div`
  ${(p) =>
    p.collapsed &&
    css`
      display: none;
    `}
`;

const MenuExpandOrCollapseIconWrapper = styled.span`
  ${m_r(8)};
  ${inline_flex};
  ${items_center};
`;

function defaultItemRender(icon, name, activeCount, isExternalLink) {
  return (
    <ItemInner>
      {icon}
      <span>
        {name}
        {!!activeCount && <ItemActiveCount>{activeCount}</ItemActiveCount>}
      </span>
      {isExternalLink && <ExternalLink color="var(--textDisabled)" />}
    </ItemInner>
  );
}

function MenuGroup({ menu, defaultExpanded }) {
  const chain = useChain();
  const router = useRouter();
  const dispatch = useSettingsDispatch();
  const expandedMenus = useHomeExpandedMenus();
  const hasMenuItems = !!menu?.items?.length;

  const expandedValue = !isNil(expandedMenus[menu.name])
    ? expandedMenus[menu.name]
    : defaultExpanded;

  const [expanded, setExpanded] = useState(expandedValue);
  const collapsed = useMemo(() => !expanded, [expanded]);

  useEffect(() => {
    if (hasMenuItems) {
      setExpanded(expandedValue);
    } else {
      setExpanded(false);
    }
  }, []);

  function toggleExpandMenu() {
    const v = collapsed;
    setExpanded(v);
    updateHomeExpandedMenus(menu.name, v, dispatch);
  }

  return (
    <div>
      {menu.name && (
        <TitleGroup role="button" onClick={toggleExpandMenu}>
          <MenuExpandOrCollapseIconWrapper>
            {collapsed ? <MenuFoldIcon /> : <MenuUnFoldIcon />}
          </MenuExpandOrCollapseIconWrapper>

          <Title>
            {menu.name}
            {collapsed && !!menu.activeCount && (
              <TitleActiveCount>{menu.activeCount}</TitleActiveCount>
            )}
          </Title>
        </TitleGroup>
      )}

      <ItemGroup collapsed={menu.name && collapsed}>
        {menu.items.map((item, index) => {
          const isExternalLink = (item.pathname || "").startsWith("http");

          if (item?.excludeToChains?.includes(chain)) {
            return null;
          }

          if (item.component) {
            return item.component;
          }

          return (
            <Fragment key={index}>
              <Link
                href={item?.pathname}
                passHref
                target={isExternalLink ? "_blank" : "_self"}
              >
                <Item
                  active={
                    router.pathname === item.pathname ||
                    router.asPath === item.pathname ||
                    (router.pathname === "/[chain]" && item.pathname === "/")
                  }
                >
                  {item.itemRender?.(item.icon, item.name, item.activeCount) ??
                    defaultItemRender(
                      item.icon,
                      item.name,
                      item.activeCount,
                      isExternalLink,
                    )}
                </Item>
              </Link>
            </Fragment>
          );
        })}
      </ItemGroup>
    </div>
  );
}

export default function Menu({ menu = [] }) {
  const chain = useChain();

  const excludedChainsMenu = menu.filter(
    (m) => !m?.excludeToChains?.includes(chain),
  );

  const defaultExpanded =
    getHomeMenuGroupDefaultBehaviorByCounts(
      excludedChainsMenu.filter((m) => m.name && m.items?.length).length,
    ) === "expand";

  return (
    <Wrapper>
      <MenuCMDKButton buttonStyle={{ marginBottom: 16 }} />

      <MenuWrapper>
        {menu.map((menu, index) => {
          if (menu?.excludeToChains?.includes(chain)) {
            return null;
          }

          return (
            <MenuGroup
              key={index}
              menu={menu}
              defaultExpanded={defaultExpanded}
            />
          );
        })}
      </MenuWrapper>
    </Wrapper>
  );
}
