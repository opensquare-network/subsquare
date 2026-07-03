import * as Popover from "@radix-ui/react-popover";
import { SystemFilter } from "@osn/icons/subsquare";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { useState } from "react";
import { useUpdateEffect } from "react-use";
import ToggleOption from "next-common/components/toggleOption";
import TreasurySpendStatusSelectField from "./treasurySpendStatusSelectField";

export default function TreasurySpendFilter() {
  const [committedFilter, setCommittedFilter] = useCommittedFilterState();
  const status = committedFilter?.status || "";
  const validOnly = committedFilter?.valid_only === "true";

  const [stateOpen, setStateOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    status,
    validOnly,
  });

  useUpdateEffect(() => {
    setValue((val) => {
      return {
        ...val,
        status,
        validOnly,
      };
    });
  }, [status, validOnly]);

  const filterCount = Object.values({
    status,
    validOnly,
  }).filter(Boolean).length;

  function handleApply() {
    const filters = {
      status: value.status,
      valid_only: value.validOnly,
    };
    setCommittedFilter(filters);
    setOpen(false);
  }

  function handleReset() {
    setValue({ status: "", validOnly: false });
    setCommittedFilter({ status: "", valid_only: false });
    setOpen(false);
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(open) => {
        if (!open && stateOpen) {
          return setStateOpen(false);
        }
        setOpen(open);
      }}
    >
      <Popover.Trigger asChild>
        <SecondaryButton
          size="small"
          iconLeft={<SystemFilter className="w-4 h-4" />}
        >
          Filter
          {!!filterCount && (
            <span className="text-textTertiary ml-1">{filterCount}</span>
          )}
        </SecondaryButton>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content sideOffset={8} align="end">
          <NeutralPanel className="p-4 w-80 max-w-full text12Medium text-textPrimary shadow-200">
            <div className="mb-4 text12Bold">Conditions</div>

            <div>
              <div className="py-3 space-y-4">
                <ToggleOption
                  label="Valid only"
                  tooltip="Only show spends that can be claimed immediately"
                  isOn={value?.validOnly}
                  setIsOn={(isOn) => {
                    setValue?.((val) => ({
                      ...val,
                      validOnly: isOn,
                    }));
                  }}
                />
              </div>

              <div className="flex items-center justify-between py-1.5">
                <div>Status</div>

                <TreasurySpendStatusSelectField
                  open={stateOpen}
                  onOpenChange={setStateOpen}
                  value={value?.status}
                  onChange={(status) => {
                    setValue?.((val) => {
                      return {
                        ...val,
                        status: status,
                      };
                    });
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end items-center gap-x-2 mt-4">
              <SecondaryButton size="small" onClick={handleReset}>
                Reset
              </SecondaryButton>
              <PrimaryButton size="small" onClick={handleApply}>
                Apply
              </PrimaryButton>
            </div>
          </NeutralPanel>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
