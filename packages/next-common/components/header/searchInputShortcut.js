import React from "react";
import { useKey } from "../../utils/hooks/useKey";
import { ShortcutSlash } from "@osn/icons/subsquare";

const ignoreTagNames = ["INPUT", "TEXTAREA"];

export default function SearchBarShortcut({ focus, inputRef }) {
  useKey(
    "/",
    (event) => {
      if (ignoreTagNames.includes(event.target?.tagName)) {
        return;
      }

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

  return <ShortcutSlash className="[&_path]:fill-textDisabled" />;
}
