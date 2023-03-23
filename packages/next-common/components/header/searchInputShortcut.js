import React from "react";
import { useKey } from "../../utils/hooks/useKey";
import SlashShortIcon from "../icons/slashShortcut";

export default function SearchBarShortcut({ focus, inputRef }) {
  useKey(
    "/",
    (event) => {
      if (!focus) {
        event.preventDefault();
        inputRef.current.focus();
      }
    },
    null,
    null,
    focus,
  );

  useKey("Escape", () => {
    inputRef.current.blur();
  });

  if (focus) {
    return null;
  }

  return <SlashShortIcon />;
}
