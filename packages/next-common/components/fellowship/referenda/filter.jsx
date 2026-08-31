import * as Popover from "@radix-ui/react-popover";
import { SystemFilter } from "@osn/icons/subsquare";
import { camelCase, pickBy, snakeCase, upperFirst } from "lodash-es";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import UnVotedOnlyOption from "next-common/components/referenda/unVotedOnlyOption";
import { useUnVotedOnlyContext } from "next-common/components/referenda/list/unVotedContext";
import { usePageProps } from "next-common/context/page";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUpdateEffect } from "react-use";

export default function FellowshipReferendaFilter({ isUnVotedOnlyLoading }) {
  const { status: statusProp } = usePageProps();
  const status = upperFirst(camelCase(statusProp));
  const router = useRouter();
  const address = useRealAddress();
  const { unVotedOnly, setUnVotedOnly } = useUnVotedOnlyContext();
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({ status, unVotedOnly });

  useUpdateEffect(() => {
    setValue((currentValue) => ({
      ...currentValue,
      status,
      unVotedOnly,
    }));
  }, [status, unVotedOnly]);

  const filterCount = [status, unVotedOnly].filter(Boolean).length;

  async function handleApply() {
    const isStatusChanged = value.status !== status;
    const isUnVotedOnlyChanged = value.unVotedOnly !== unVotedOnly;

    if (isStatusChanged) {
      await router.replace({
        query: pickBy(
          {
            status: snakeCase(value.status),
          },
          Boolean,
        ),
      });
    } else if (isUnVotedOnlyChanged) {
      setUnVotedOnly(value.unVotedOnly);
    }

    setIsOpen(false);
  }

  async function handleReset() {
    setIsOpen(false);
    await router.replace("");
  }

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isStatusSelectOpen) {
          setIsStatusSelectOpen(false);
          return;
        }

        setIsOpen(open);
      }}
    >
      <Popover.Trigger asChild>
        <SecondaryButton
          size="small"
          iconLeft={<SystemFilter className="w-4 h-4" />}
        >
          Filter
          {!!filterCount && (
            <span className="ml-1 text-textTertiary">{filterCount}</span>
          )}
        </SecondaryButton>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content sideOffset={8} align="end">
          <NeutralPanel className="w-80 max-w-full p-4 text12Medium text-textPrimary shadow-200">
            <div className="mb-4 text12Bold">Conditions</div>

            <div>
              {address && (
                <div className="py-3">
                  <UnVotedOnlyOption
                    tooltip="Only referenda I can but haven't voted"
                    className="justify-between"
                    isOn={value.unVotedOnly}
                    setIsOn={(unVotedOnly) => {
                      setValue((currentValue) => ({
                        ...currentValue,
                        unVotedOnly,
                      }));
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between py-1.5">
                <div>Status</div>
                <ReferendaStatusSelectField
                  open={isStatusSelectOpen}
                  onOpenChange={setIsStatusSelectOpen}
                  value={value.status}
                  onChange={(nextStatus) => {
                    setValue((currentValue) => ({
                      ...currentValue,
                      status: nextStatus,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-x-2">
              <SecondaryButton size="small" onClick={handleReset}>
                Reset
              </SecondaryButton>
              <PrimaryButton
                size="small"
                onClick={handleApply}
                loading={isUnVotedOnlyLoading}
              >
                Apply
              </PrimaryButton>
            </div>
          </NeutralPanel>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
