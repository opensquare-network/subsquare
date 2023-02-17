import { useRouter } from "next/router";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import styled from "styled-components";
import { useState } from "react";
import {
  bg_theme,
  border,
  border_theme_grey200,
  cursor_pointer,
  gap_x,
  inline_flex,
  items_center,
  justify_between,
  m_b,
  m_l,
  p_x,
  p_y,
  rounded_4,
  text_tertiary,
  text_theme,
  w_full,
} from "../../styles/tailwindcss";
import {
  p_12_medium,
  p_14_medium,
  shadow_100,
} from "../../styles/componentCss";
import ClosePanelIcon from "../icons/closePanel";
import capitalize from "../../utils/capitalize";
import MenuIcon from "../icons/menu";
import commonMenus from "../../utils/consts/menu/common";
import { isExternalLink } from "../../utils";
import { isMacOS } from "../../utils/constants";
import { useEventListener } from "../../utils/hooks/useEventListener";

const Trigger = styled.button([
  [
    p_x(18),
    p_y(10),
    m_b(8),
    bg_theme("neutral"),
    shadow_100,
    rounded_4,
    p_14_medium,
    border,
    text_tertiary,
    border_theme_grey200,
    w_full,
    cursor_pointer,
    inline_flex,
    gap_x(8),
    items_center,
    justify_between,
  ],
]);

const HotKey = styled.span([
  [
    bg_theme("primaryPurple100"),
    text_theme("primaryPurple500"),
    rounded_4,
    p_x(8),
    p_y(2),
    p_12_medium,
    m_l(8),
  ],
]);

export default function NavigationCMDK({ menu = [] }) {
  const router = useRouter();

  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const foldedMenu = menu.filter((m) => m.name && m.items?.length);

  const filteredItems = filterItems(
    [
      {
        id: "home",
        items: [
          ...commonMenus.items.map((m) => {
            return {
              id: m.name,
              children: capitalize(m.name?.toLowerCase()),
              icon: () => m.icon,
              onClick() {
                const url = m.pathname;
                if (url) {
                  if (isExternalLink(url)) {
                    window.open(url, "_blank");
                  } else {
                    router.push(url);
                  }
                }
              },
            };
          }),
          ...foldedMenu.map((m) => {
            return {
              id: m.name,
              children: capitalize(m.name?.toLowerCase()),
              icon: () => <MenuIcon />,
              closeOnSelect: false,
              onClick() {
                setPage(m.name);
              },
            };
          }),
        ],
      },
    ],
    search
  );

  const pages = [
    {
      id: "home",
      filteredItems,
    },
  ];

  useEventListener("keydown", (e) => {
    const modifierKey = isMacOS ? e.metaKey : e.ctrlKey;
    if (modifierKey && e.key === "k") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
  });

  return (
    <div>
      <Trigger onClick={() => setOpen(true)}>
        <span>
          Navigation <HotKey>{isMacOS ? "⌘" : "Ctrl"} K</HotKey>
        </span>
        <ClosePanelIcon />
      </Trigger>

      <CommandPalette
        page={page}
        onChangeSearch={setSearch}
        isOpen={open}
        onChangeOpen={setOpen}
        search={search}
      >
        {pages.map((item) => (
          <CommandPalette.Page id={item.id} key={item.id}>
            {item.filteredItems.length ? (
              item.filteredItems.map((list) => (
                <CommandPalette.List key={list.id} heading={list.heading}>
                  {list.items.map(({ id, ...rest }) => (
                    <CommandPalette.ListItem
                      key={id}
                      index={getItemIndex(item.filteredItems, id)}
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
