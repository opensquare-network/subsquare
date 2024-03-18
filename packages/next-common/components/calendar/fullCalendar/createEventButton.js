import React from "react";
import { noop } from "lodash-es";
import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import { SystemPlus } from "@osn/icons/subsquare";

export default function CreateEventButton({ disabled, onClick = noop }) {
  return (
    <Tooltip content={disabled ? "Only admins can create events" : ""}>
      <PrimaryButton
        size="small"
        className="w-7 p-0 sm:hidden"
        disabled={disabled}
        onClick={onClick}
      >
        <SystemPlus className="w-4 h-4" />
      </PrimaryButton>

      <PrimaryButton
        size="small"
        className="max-sm:hidden"
        disabled={disabled}
        onClick={onClick}
        iconLeft={<SystemPlus className="w-4 h-4" />}
      >
        Create Event
      </PrimaryButton>
    </Tooltip>
  );
}
