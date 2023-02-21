import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import styled, { createGlobalStyle } from "styled-components";
import React, { useState, useMemo } from "react";
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

// next-common/styles/cmdk.css
const CmdkGlobalStyle = createGlobalStyle`
  .command-palette {
    z-index: 1000;
  }
  .command-palette-content h4 {
    ${p_12_bold};
    font-size: 12px !important;
    font-weight: 700 !important;
    line-height: 12px !important;
    letter-spacing: 0.16em;
    ${p_y(8)};
  }
  .command-palette-list-item {
    & div:first-child  {
      width: auto !important;
      ${p_14_medium};
      ${text_capitalize};
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
  const { href, ...restProps } = props ?? {};

  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        {...restProps}
        children={{
          ...restProps.children,
          // unsafe, force change the `type` text to `External Link`
          props: { ...restProps.children.props, type: "External Link" },
        }}
        target="_blank"
      />
    );
  }

  return (
    <Link href={href} passHref>
      <a {...restProps} />
    </Link>
  );
}

export default function NavigationCMDK({ menu = [], triggerButtonStyle }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const cmdkTriggerVisible = useSelector(cmdkTriggerVisibleSelector);

  const foldedMenu = menu.filter((m) => m.name && m.items?.length);

  const pages = useMemo(() => {
    const subPageItems = foldedMenu.map((m) => {
      const filteredItems = filterItems(
        [
          {
            id: m.name,
            heading: m.name,
            items: m.items.map((i) => {
              return {
                id: m.name + "-" + i.name,
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
              ...commonMenus.items.map((i) => {
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
            Navigation <HotKey>{isMacOS ? "⌘ " : "Ctrl +"} K</HotKey>
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
