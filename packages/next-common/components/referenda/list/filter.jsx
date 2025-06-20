import * as Popover from "@radix-ui/react-popover";
import { SystemFilter } from "@osn/icons/subsquare";
import { camelCase, isEqual, pickBy, snakeCase, upperFirst } from "lodash-es";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { useRouter } from "next/router";
import { useState } from "react";
import ToggleOption from "next-common/components/toggleOption";
import { useIsTreasuryState, useIsOngoingState } from ".";
import { useUnVotedOnlyContext } from "./unVotedContext";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { usePageProps } from "next-common/context/page";
import { useUpdateEffect } from "react-use";
import UnVotedOnlyOption from "../unVotedOnlyOption";

export default function ReferendaListFilter({ isUnVotedOnlyLoading }) {
  const {
    isTreasury: isTreasuryProp,
    status: statusProp,
    ongoing: ongoingProp,
  } = usePageProps();
  const status = upperFirst(camelCase(statusProp));
  const router = useRouter();

  const address = useRealAddress();
  const { unVotedOnly, setUnVotedOnly } = useUnVotedOnlyContext();
  const [isTreasury, setIsTreasury] = useIsTreasuryState();
  const [ongoing, setOngoing] = useIsOngoingState();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    status,
    unVotedOnly,
    isTreasury,
    ongoing,
  });

  useUpdateEffect(() => {
    setValue((val) => {
      return {
        ...val,
        isTreasury,
        status,
        ongoing,
      };
    });
  }, [isTreasury, status, ongoing]);

  const filterCount = Object.values({
    status,
    unVotedOnly,
    isTreasury: isTreasuryProp === "true",
    ongoing: ongoingProp === "true",
  }).filter(Boolean).length;

  async function handleApply() {
    const q = pickBy(
      {
        status: value.status,
        is_treasury: value.isTreasury,
        ongoing: value.ongoing,
      },
      Boolean,
    );

    const params = pickBy(
      {
        status: statusProp,
        is_treasury: isTreasuryProp === "true",
        ongoing: ongoingProp === "true",
      },
      Boolean,
    );

    setIsTreasury(value?.isTreasury);
    setUnVotedOnly(value?.unVotedOnly);
    setOngoing(value?.ongoing);

    const shouldUpdateRoute = !isEqual(q, params);
    if (shouldUpdateRoute) {
      const query = q;
      query.status = snakeCase(q.status);

      await router.replace({ query: pickBy(query, Boolean) });
    }

    setOpen(false);
  }

  async function handleReset() {
    setUnVotedOnly(false);
    setIsTreasury(false);
    setOngoing(false);
    setOpen(false);

    await router.replace("");
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
              <div className="py-3 space-y-4">
                <ToggleOption
                  label="Treasury related"
                  tooltip="Only show the referenda that requested treasury"
                  isOn={value?.isTreasury}
                  setIsOn={(isOn) => {
                    setValue?.((val) => ({
                      ...val,
                      isTreasury: isOn,
                    }));
                  }}
                />

                <ToggleOption
                  label="Ongoing"
                  tooltip="Only show the ongoing referenda"
                  isOn={value?.ongoing}
                  setIsOn={(isOn) => {
                    setValue?.((val) => ({
                      ...val,
                      ongoing: isOn,
                    }));
                  }}
                />

                {address && (
                  <UnVotedOnlyOption
                    className="justify-between"
                    isOn={value?.unVotedOnly}
                    setIsOn={(isOn) => {
                      setValue?.((val) => ({
                        ...val,
                        unVotedOnly: isOn,
                      }));
                    }}
                  />
                )}
              </div>

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
