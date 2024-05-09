import React from "react";
import { SystemCheckboxOff, SystemCheckboxOn } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import { cn } from "next-common/utils";

export default function Checkbox({ checked, className, onClick = noop }) {
  return (
    <div
      className="cursor-pointer flex justify-center items-center gap-[10px]"
      onClick={onClick}
    >
      {checked ? (
        <SystemCheckboxOn className={cn("[&_rect]:fill-theme500", className)} />
      ) : (
        <SystemCheckboxOff
          className={cn("[&_rect]:stroke-textTertiary", className)}
        />
      )}
    </div>
  );
}
