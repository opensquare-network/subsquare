import React, { useState, useMemo } from "react";
import CommandPalette, { filterItems, getItemIndex } from "@osn/react-cmdk";
import { createGlobalStyle, useTheme } from "styled-components";
import {
  bg_theme,
  p_y,
  text_capitalize,
  text_primary,
} from "../../styles/tailwindcss";
import { p_12_bold, p_14_medium } from "../../styles/componentCss";
import { useEventListener } from "../../utils/hooks/useEventListener";
import Link from "next/link";
import { isExternalLink } from "../../utils";
import MenuIcon from "../icons/menu";
import commonMenus from "../../utils/consts/menu/common";
import { useIsMacOS, usePageProps } from "next-common/context/page";
import { getHomeMenu } from "next-common/utils/consts/menu";
import { useChain } from "next-common/context/chain";
import {
  cmdkPaletteVisibleSelector,
  setCmdkPaletteVisible,
} from "next-common/store/reducers/cmdkSlice";
import { useSelector, useDispatch } from "react-redux";

// next-common/styles/cmdk.css
const CmdkGlobalStyle = createGlobalStyle`
  .command-palette {
    z-index: 1000;

    .command-palette-content h4 {
      ${p_12_bold};
      letter-spacing: 0.16em;
      ${p_y(8)};
    }
    .command-palette-content .fixed.inset-0 {
      background-color: rgba(0, 0, 0, 0.25);
    }
    .command-palette-content-panel {
      ${bg_theme("neutral")};
    }
    .command-palette-list-item {
      &.bg-gray-200/50 {
        background-color: var(--neutral200);
      }
      &.bg-gray-800 {
        background-color: var(--neutral200);
      }
      
      &:hover {
        background-color: var(--neutral200);
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
    <Link href={href} passHref {...restProps}>
      {children}
    </Link>
  );
}

export default function CMDKPalette() {
  const chain = useChain();
  const { isDark } = useTheme();
  const isMacOS = useIsMacOS();
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const cmdkPaletteVisible = useSelector(cmdkPaletteVisibleSelector);
  const dispatch = useDispatch();

  const { tracks, fellowshipTracks } = usePageProps();
  const homeMenus = getHomeMenu({ tracks, fellowshipTracks });
  function filterExcludeChains(item) {
    return !item?.excludeToChains?.includes(chain);
  }

  const foldedMenu = homeMenus
    .filter((menu) => menu.name && menu.items?.length)
    .filter(filterExcludeChains)
    .map((menu) => {
      const items = (menu.items || []).filter(filterExcludeChains);
      return {
        ...menu,
        items,
      };
    });
  const pages = useMemo(() => {
    const subPageItems = foldedMenu.map((m) => {
      const filteredItems = filterItems(
        [
          {
            id: m.name,
            heading: m.name,
            items: m.items.map((i, idx) => {
              return {
                id: m.name + "-" + i.name + `-${idx}`,
                children: i.name,
                icon: () => i.icon,
                href: i.pathname,
              };
            }),
          },
        ],
        search,
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
              ...commonMenus.items.filter(filterExcludeChains).map((i) => {
                return {
                  id: i.name,
                  children: i.name,
                  icon: () => i.icon,
                  href: i.pathname,
                };
              }),
              ...foldedMenu.map((m) => {
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
        search,
      ),
    };

    return [homePageItem, ...subPageItems];
  }, [foldedMenu, search]);

  function onPageEscape(page) {
    if (page.id === "home") {
      dispatch(setCmdkPaletteVisible(false));
      return;
    }
    setPage("home");
  }

  useEventListener("keydown", (e) => {
    const modifierKey = isMacOS ? e.metaKey : e.ctrlKey;
    if (modifierKey && e.key === "k") {
      e.preventDefault();
      e.stopPropagation();
      dispatch(setCmdkPaletteVisible(true));
    }
  });

  return (
    <>
      <CmdkGlobalStyle />

      <CommandPalette
        page={page}
        onChangeSearch={setSearch}
        isOpen={cmdkPaletteVisible}
        onChangeOpen={(v) => dispatch(setCmdkPaletteVisible(v))}
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
    </>
  );
}
