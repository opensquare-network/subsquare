import { useState } from "react";
import { isNil } from "lodash-es";
import * as Popover from "@radix-ui/react-popover";
import { SystemMore } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import useCoretimeStatus from "next-common/context/coretime/status";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { RegionStatus } from "./utils";

export default function RegionActionColumn({ region, onAction }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const realAddress = useRealAddress();
  const lastCommittedTimeslice = useCoretimeStatus()?.lastCommittedTimeslice;
  const isOwner = isSameAddress(region.owner, realAddress);
  const isExpired = region.status === RegionStatus.Expired;
  const canSchedule =
    isOwner &&
    !isExpired &&
    !isNil(lastCommittedTimeslice) &&
    region.end > lastCommittedTimeslice + 1;
  const availableActions = [
    { action: "details", title: "Details", canOpen: true },
    { action: "assign", title: "Assign", canOpen: canSchedule },
    { action: "pool", title: "Pool", canOpen: canSchedule },
    { action: "transfer", title: "Transfer", canOpen: isOwner },
    {
      action: "partition",
      title: "Partition",
      canOpen: isOwner && region.end - region.begin > 1,
    },
    {
      action: "interlace",
      title: "Interlace",
      canOpen: isOwner && region.parts > 1,
    },
  ].filter(({ canOpen }) => canOpen);

  const handleSelectAction = (nextAction) => {
    if (!availableActions.some(({ action }) => action === nextAction)) {
      return;
    }

    setIsMenuOpen(false);
    onAction({ action: nextAction, region });
  };

  return (
    <Popover.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <Popover.Trigger asChild>
        <SecondaryButton aria-label="Region actions" className="w-7 h-7 p-0">
          <SystemMore className="w-4 h-4" />
        </SecondaryButton>
      </Popover.Trigger>
      {isMenuOpen && (
        <Popover.Portal>
          <Popover.Content
            side="top"
            align="end"
            sideOffset={5}
            className="z-50"
          >
            <OptionWrapper className="static !shadow-200">
              {availableActions.map(({ action, title }) => (
                <OptionItem
                  key={action}
                  $as="button"
                  type="button"
                  className="w-full"
                  onClick={() => handleSelectAction(action)}
                >
                  {title}
                </OptionItem>
              ))}
            </OptionWrapper>
          </Popover.Content>
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}
