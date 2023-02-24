import CommandPalette, { filterItems, getItemIndex } from "@osn/react-cmdk";
import styled, { createGlobalStyle, useTheme } from "styled-components";
import React, { useState, useMemo, useEffect } from "react";
import {
  bg_theme,
  border,
  border_theme_grey200,
  cursor_pointer,
  gap_x,
  inline_flex,
  items_center,
  justify_between,
  m_l,
  outline_none,
  p_x,
  p_y,
  rounded_4,
  text_capitalize,
  text_primary,
  text_tertiary,
  text_theme,
  w_full,
} from "../../styles/tailwindcss";
import {
  p_12_bold,
  p_12_medium,
  p_14_medium,
  shadow_100,
} from "../../styles/componentCss";
import ClosePanelIcon from "../icons/closePanel";
import MenuIcon from "../icons/menu";
import commonMenus from "../../utils/consts/menu/common";
import homeMenus from "../../utils/consts/menu";
import { isMacOS } from "../../utils/constants";
import { useEventListener } from "../../utils/hooks/useEventListener";
import { useSelector } from "react-redux";
import {
  cmdkTriggerVisibleSelector,
  setCmdkTriggerVisible,
} from "../../store/reducers/cmdkSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { isExternalLink } from "../../utils";
import { useChain } from "../../context/chain";
import { useGov2Menu } from "../../utils/hooks/useGov2Menu";

// next-common/styles/cmdk.css
const CmdkGlobalStyle = createGlobalStyle`
  .command-palette {
    z-index: 1000;

    .command-palette-content h4 {
      ${p_12_bold};
      letter-spacing: 0.16em;
      ${p_y(8)};
    }
    .command-palette-content-panel {
      ${bg_theme("neutral")};
    }
    .command-palette-list-item {
      &.bg-gray-200/50 {
        background-color: ${(p) => p.theme.grey100Bg};
      }
      &.bg-gray-800 {
        background-color: ${(p) => p.theme.grey100Bg};
      }
      
      &:hover {
        background-color: ${(p) => p.theme.grey100Bg};
      }

      & div:first-child  {
        width: auto;
        ${p_14_medium};
        ${text_primary};
        ${text_capitalize};
      }
    }
  }
`;

const Trigger = styled.button`
  ${p_x(18)};
  ${p_y(10)};
  ${bg_theme("neutral")};
  ${shadow_100};
  ${rounded_4};
  ${p_14_medium};
  ${border};
  ${text_tertiary};
  ${border_theme_grey200};
  ${w_full};
  ${cursor_pointer};
  ${inline_flex};
  ${gap_x(8)};
  ${items_center};
  ${justify_between};
  ${outline_none};
`;

const HotKey = styled.span`
  ${bg_theme("primaryPurple100")};
  ${text_theme("primaryPurple500")};
  ${rounded_4};
  ${p_x(8)};
  ${p_y(2)};
  ${p_12_medium};
  ${m_l(8)};
`;

function renderCommandPaletteLink(props) {
  const { href, children, ...restProps } = props ?? {};

  if (isExternalLink(href)) {
    return (
      <a href={href} {...restProps} target="_blank" rel="noreferrer">
        {{
          ...children,
          // unsafe, force change the `type` text to `External Link`
          props: { ...children.props, type: "External Link" },
        }}
      </a>
    );
  }

  return (
    <Link href={href} passHref>
      <a {...restProps}>{children}</a>
    </Link>
  );
}

export default function NavigationCMDK({ triggerButtonStyle }) {
  const chain = useChain();
  const dispatch = useDispatch();
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const cmdkTriggerVisible = useSelector(cmdkTriggerVisibleSelector);
  const gov2Menu = useGov2Menu();
  const { isDark } = useTheme();

  const [metaKeySymbol, setMetaKeySymbol] = useState("Ctrl +");
  useEffect(() => {
    if (isMacOS) setMetaKeySymbol("⌘");
  }, []);

  const foldedMenu = [...gov2Menu, ...homeMenus].filter(
    (m) => m.name && m.items?.length
  ).filter(menu => !(menu.excludeToChains || []).includes(chain)).map(menu => {
    const items = (menu.items || []).filter(item => !(item.excludeToChains || []).includes(chain))
    return {
      ...menu,
      items,
    }
  });

  function filterChain(item) {
    return !item?.excludeToChains?.includes(chain);
  }

  const pages = useMemo(() => {
    const subPageItems = foldedMenu.map((m) => {
      const filteredItems = filterItems(
        [
          {
            id: m.name,
            heading: m.name,
            items: m.items.filter(filterChain).map((i, idx) => {
              return {
                id: m.name + "-" + i.name + `-${idx}`,
                children: i.name,
                icon: () => i.icon,
                href: i.pathname,
              };
            }),
          },
        ],
        search
      );

      return {
        id: m.name,
        searchPrefix: [m.name.toLowerCase()],
        filteredItems,
      };
    });

    const homePageItem = {
      id: "home",
      filteredItems: filterItems(
        [
          {
            id: "home",
            items: [
              ...commonMenus.items.filter(filterChain).map((i) => {
                return {
                  id: i.name,
                  children: i.name,
                  icon: () => i.icon,
                  href: i.pathname,
                };
              }),
              ...foldedMenu.filter(filterChain).map((m) => {
                return {
                  id: m.name,
                  children: m.name?.toLowerCase(),
                  icon: () => <MenuIcon />,
                  closeOnSelect: false,
                  onClick() {
                    setSearch("");
                    setPage(m.name);
                  },
                };
              }),
            ],
          },
          ...(search && subPageItems.map((i) => i.filteredItems).flat()),
        ],
        search
      ),
    };

    return [homePageItem, ...subPageItems];
  }, [foldedMenu, search]);

  useEventListener("keydown", (e) => {
    const modifierKey = isMacOS ? e.metaKey : e.ctrlKey;
    if (modifierKey && e.key === "k") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
  });

  function onPageEscape(page) {
    if (page.id === "home") {
      setOpen(false);
      return;
    }
    setPage("home");
  }

  return (
    <div>
      <CmdkGlobalStyle />

      {cmdkTriggerVisible && (
        <Trigger onClick={() => setOpen(true)} style={triggerButtonStyle}>
          <span>
            Navigation <HotKey>{metaKeySymbol} K</HotKey>
          </span>
          <ClosePanelIcon
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setCmdkTriggerVisible(false));
            }}
          />
        </Trigger>
      )}

      <CommandPalette
        page={page}
        onChangeSearch={setSearch}
        isOpen={open}
        onChangeOpen={setOpen}
        search={search}
        renderLink={renderCommandPaletteLink}
        theme={isDark ? "dark" : "light"}
      >
        {pages.map((page) => (
          <CommandPalette.Page
            id={page.id}
            key={page.id}
            onEscape={() => onPageEscape(page)}
            searchPrefix={page.searchPrefix}
          >
            {page.filteredItems.length ? (
              page.filteredItems.map((list) => (
                <CommandPalette.List key={list.id} heading={list.heading}>
                  {list.items.map(({ id, ...rest }) => (
                    <CommandPalette.ListItem
                      key={id}
                      index={getItemIndex(page.filteredItems, id)}
                      {...rest}
                    />
                  ))}
                </CommandPalette.List>
              ))
            ) : (
              <CommandPalette.FreeSearchAction />
            )}
          </CommandPalette.Page>
        ))}
      </CommandPalette>
    </div>
  );
}
