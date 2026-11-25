import { noop } from "lodash-es";
import { gov2State } from "next-common/utils/consts/state";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { cn } from "next-common/utils";
import { ArrowDown } from "@osn/icons/subsquare";

const NONE = "none";
const options = [
  {
    value: NONE,
    label: <Label label="All status" />,
  },
  ...[
    gov2State.Deciding,
    gov2State.Confirming,
    gov2State.Preparing,
    gov2State.Queueing,
    gov2State.Approved,
    gov2State.Executed,
    gov2State.Rejected,
    gov2State.TimedOut,
    gov2State.Cancelled,
    gov2State.Killed,
  ].map((label) => {
    return {
      label: <Label label={label} />,
      value: label,
    };
  }),
];

export default function ReferendaStatusSelectField({
  value = "",
  onChange = noop,
  open,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const selectedValue = value || NONE;
  const selectedLabel = options.find(
    (item) => item.value === selectedValue,
  )?.label;

  return (
    <DropdownMenu.Root
      modal={false}
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (open === undefined) {
          setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      }}
    >
      <DropdownMenu.Trigger
        aria-label="Referendum status"
        className=" flex justify-between items-center min-w-5 w-[160px] h-[28px] bg-neutral100 border border-neutral400 cursor-pointer text-textPrimary rounded-md py-1.5 px-1.5 pl-4"
      >
        {selectedLabel}
        <div>
          <ArrowDown
            className={cn(
              isOpen && "rotate-180",
              "w-5 h-5",
              "[&_path]:stroke-textTertiary",
            )}
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="center"
          className={cn(
            "max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-x-hidden overflow-y-auto relative z-50",
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            "bg-neutral100 shadow-200 rounded py-2 px-0 text-textPrimary dark:border dark:border-neutral300",
          )}
        >
          <DropdownMenu.RadioGroup
            value={selectedValue}
            onValueChange={(status) => onChange(status === NONE ? "" : status)}
          >
            {options.map((item) => (
              <DropdownMenu.RadioItem
                className={cn(
                  "px-6 py-2.5 data-[highlighted]:bg-neutral200 outline-none cursor-pointer w-[160px]",
                  item.value === selectedValue && "bg-neutral200",
                )}
                key={item.value}
                value={item.value}
              >
                {item.label}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Label({ label }) {
  const colors = {
    [gov2State.Preparing]: "var(--azure500)",
    [gov2State.Queueing]: "var(--orange500)",
    [gov2State.Deciding]: "var(--blue500)",
    [gov2State.Confirming]: "var(--green500)",
    [gov2State.Executed]: "var(--green500)",
    [gov2State.Approved]: "var(--green500)",
    [gov2State.Rejected]: "var(--red500)",
    [gov2State.Killed]: "var(--red500)",
    [gov2State.Cancelled]: "var(--red500)",
    [gov2State.TimedOut]: "var(--neutral500)",
  };

  return (
    <div className="flex gap-x-2 items-center text12Medium">
      {colors[label] && (
        <span
          className="w-1.5 h-1.5 rounded"
          style={{ backgroundColor: colors[label] }}
        />
      )}
      <span>{label}</span>
    </div>
  );
}
