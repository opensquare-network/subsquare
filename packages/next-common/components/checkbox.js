import React from "react";
import { SystemCheckboxOff, SystemCheckboxOn } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import { cn } from "next-common/utils";

export default function Checkbox({ checked, className, onClick = noop }) {
  return (
    <div
      className="flex justify-center items-center gap-[10px]"
      // eslint-disable-next-line
      role="checkbox"
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
