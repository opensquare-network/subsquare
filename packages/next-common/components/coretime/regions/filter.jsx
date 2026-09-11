import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { SystemFilter } from "@osn/icons/subsquare";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Select from "next-common/components/select";
import ToggleOption from "next-common/components/toggleOption";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { RegionStatus } from "./utils";

const statusOptions = [
  { value: "", label: "All status" },
  ...[RegionStatus.Upcoming, RegionStatus.Active, RegionStatus.Expired].map(
    (status) => ({ value: status, label: status }),
  ),
];

export default function RegionFilter({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const filterCount = Number(!!value.status) + Number(!!value.includeExpired);

  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      setDraft(value);
    }
    setIsOpen(isOpen);
  };

  const handleApply = async () => {
    await onChange(draft);
    setIsOpen(false);
  };

  const handleReset = async () => {
    await onChange({ status: "", includeExpired: false });
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
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
        <Popover.Content sideOffset={8} align="end" className="z-50">
          <NeutralPanel className="p-4 w-80 max-w-[calc(100vw-32px)] text12Medium text-textPrimary shadow-200">
            <div className="mb-4 text12Bold">Conditions</div>
            <div className="space-y-4">
              <ToggleOption
                label="Include expired"
                tooltip="Include regions whose coretime has ended"
                isOn={draft.includeExpired}
                setIsOn={(includeExpired) =>
                  setDraft((value) => ({
                    ...value,
                    includeExpired,
                    status:
                      !includeExpired && value.status === RegionStatus.Expired
                        ? ""
                        : value.status,
                  }))
                }
              />
              <div className="flex items-center justify-between gap-4">
                <span>Status</span>
                <Select
                  className="w-40 text12Medium"
                  small
                  value={draft.status}
                  options={statusOptions.filter(
                    ({ value }) =>
                      draft.includeExpired || value !== RegionStatus.Expired,
                  )}
                  onChange={({ value: status }) =>
                    setDraft((value) => ({ ...value, status }))
                  }
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
