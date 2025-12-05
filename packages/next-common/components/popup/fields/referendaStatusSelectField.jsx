import { noop } from "lodash-es";
import { gov2State } from "next-common/utils/consts/state";
import * as RadixSelect from "@radix-ui/react-select";
import { useMemo } from "react";
import { cn } from "next-common/utils";
import { ArrowDown, ArrowUp } from "@osn/icons/subsquare";

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
  const selectedLabel = useMemo(() => {
    return options?.find((item) => item.value === (value || NONE))?.label;
  }, [value]);

  return (
    <RadixSelect.Root
      open={open}
      onOpenChange={onOpenChange}
      value={value}
      onValueChange={(status) => {
        onChange(status === NONE ? "" : status);
      }}
    >
      <RadixSelect.Trigger className=" flex justify-between items-center min-w-5 w-[160px] h-[28px] bg-neutral100 border border-neutral400 cursor-pointer text-textPrimary rounded-md py-1.5 px-1.5 pl-4">
        {selectedLabel}
        <div>
          <ArrowDown
            className={cn(
              open && "rotate-180",
              "w-5 h-5",
              "[&_path]:stroke-textTertiary",
            )}
          />
        </div>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          align="center"
          className={cn(
            "max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-x-hidden overflow-y-auto relative z-50",
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            "bg-neutral100 shadow-200 rounded py-2 px-0 text-textPrimary dark:border dark:border-neutral300",
          )}
        >
          <RadixSelect.ScrollUpButton className="absolute z-10 bg-neutral100 top-0  w-full h-4 flex items-center justify-center border-neutral400 border-b">
            <ArrowUp className="w-5 h-5" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport>
            {options.map((item) => (
              <RadixSelect.Item
                className={cn(
                  "px-6 py-2.5 hover:bg-neutral200 cursor-pointer w-[160px]",
                  item.value === value && "bg-neutral200 ",
                )}
                key={item.value}
                value={item.value}
              >
                {item.label}
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="absolute z-10 bg-neutral100 bottom-0 w-full h-4 flex items-center justify-center border-neutral400 border-t">
            <ArrowDown className="w-5 h-5" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
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
