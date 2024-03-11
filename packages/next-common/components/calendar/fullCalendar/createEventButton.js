import React from "react";
import { noop } from "lodash-es";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import Tooltip from "next-common/components/tooltip";
import { SystemPlus } from "@osn/icons/subsquare";

export default function CreateEventButton({ disabled, onClick = noop }) {
  return (
    <Tooltip content={disabled ? "Only admins can create events" : ""}>
      <PrimaryButton
        small
        disabled={disabled}
        onClick={onClick}
        icon={
          <SystemPlus className="[&_path]:fill-textPrimaryContrast w-4 h-4" />
        }
      >
        <span className="max-sm:hidden">Create Event</span>
      </PrimaryButton>
    </Tooltip>
  );
}
