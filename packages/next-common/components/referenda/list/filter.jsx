import { SystemFilter } from "@osn/icons/subsquare";
import * as Popover from "@radix-ui/react-popover";
import { camelCase, isEqual, upperFirst } from "lodash-es";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { useRouter } from "next/router";
import { useState } from "react";
import UnVotedOnlyOption from "../unVotedOnlyOption";
import { useIsTreasuryState, useUnVotedOnlyState } from ".";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import TreasuryRelatedOption from "../treasuryRelatedOption";
import { usePageProps } from "next-common/context/page";
import { useUpdateEffect } from "react-use";

export default function ReferendaListFilter() {
  const { isTreasury: isTreasuryProp, status } = usePageProps();
  const router = useRouter();

  const address = useRealAddress();
  const [unVotedOnly, setUnVotedOnly] = useUnVotedOnlyState();
  const [isTreasury, setIsTreasury] = useIsTreasuryState();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    status: upperFirst(camelCase(status)),
    unVotedOnly,
    isTreasury,
  });
  useUpdateEffect(() => {
    setValue((val) => {
      return {
        ...val,
        isTreasury,
      };
    });
  }, [isTreasury]);

  const filterCount = Object.values({
    status,
    unVotedOnly,
    isTreasury: isTreasuryProp === "true",
  }).filter(Boolean).length;

  async function handleApply() {
    const q = {};

    if (value?.status) {
      q.status = value.status;
    }
    if (value?.isTreasury) {
      q.is_treasury = value.isTreasury;
    }

    setIsTreasury(value?.isTreasury);
    setUnVotedOnly(value?.unVotedOnly);

    if (!isEqual(q, router.query)) {
      await router.replace({ query: q });
    }

    setOpen(false);
  }

  async function handleReset() {
    setUnVotedOnly(false);
    await router.replace("");

    setIsTreasury(false);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
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
              <TreasuryRelatedOption
                className="justify-between py-3"
                isOn={value?.isTreasury}
                setIsOn={(isOn) => {
                  setValue?.((val) => {
                    return {
                      ...val,
                      isTreasury: isOn,
                    };
                  });
                }}
              />

              {address && (
                <UnVotedOnlyOption
                  className="justify-between py-3"
                  isOn={value?.unVotedOnly}
                  setIsOn={(isOn) => {
                    setValue?.((val) => {
                      return {
                        ...val,
                        unVotedOnly: isOn,
                      };
                    });
                  }}
                />
              )}

              <div className="flex items-center justify-between py-1.5">
                <div>Status</div>

                <ReferendaStatusSelectField
                  value={value?.status}
                  onChange={(item) => {
                    setValue?.((val) => {
                      return {
                        ...val,
                        status: item.value,
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
