import { noop } from "lodash-es";
import * as RadixSelect from "@radix-ui/react-select";
import { useMemo, useState } from "react";
import { cn } from "next-common/utils";
import { ArrowDown, ArrowUp } from "@osn/icons/subsquare";
import { useIdentityAuthorityData } from "./useSearchIdentityAuthorityData";

const NONE = "none";

export default function AuthoritySelect({ value = NONE, onChange = noop }) {
  const { data, loading } = useIdentityAuthorityData();
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    return [
      {
        value: NONE,
        label: "All Authority",
      },
      ...data.map(({ username }) => ({ label: username, value: username })),
    ];
  }, [data]);

  const selectedLabel = useMemo(() => {
    return options?.find((item) => item.value === (value || NONE))?.label;
  }, [options, value]);

  if (loading) {
    return null;
  }

  return (
    <RadixSelect.Root
      value={value}
      onValueChange={(status) => {
        onChange(status === NONE ? "" : status);
      }}
      onOpenChange={setOpen}
      disabled={loading}
    >
      <RadixSelect.Trigger className="text12Medium flex justify-between items-center min-w-5 w-[160px] h-[28px] bg-neutral100 border border-neutral400 cursor-pointer text-textPrimary rounded-md p-1.5 pl-4">
        <span>{selectedLabel}</span>
        <ArrowDown
          className={cn(
            open && "rotate-180",
            "w-5 h-5",
            "[&_path]:stroke-textTertiary",
          )}
        />
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          align="center"
          className={cn(
            "max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-x-hidden overflow-y-auto relative z-50",
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            "bg-neutral100 shadow-200 rounded py-2 text-textPrimary dark:border dark:border-neutral300",
          )}
        >
          <RadixSelect.ScrollUpButton className="absolute z-10 bg-neutral100 top-0  w-full h-4 flex items-center justify-center border-neutral400 border-b">
            <ArrowUp className="w-5 h-5" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport>
            {options.map((item) => (
              <RadixSelect.Item
                className={cn(
                  "px-6 py-2 hover:bg-neutral200 cursor-pointer w-[160px] text12Medium",
                  "data-[highlighted]:bg-neutral200 data-[highlighted]:outline-none",
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
