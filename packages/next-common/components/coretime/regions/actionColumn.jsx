import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { SystemMore } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { RegionStatus } from "./utils";

export default function RegionActionColumn({ region, onAction }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isExpired = region.status === RegionStatus.Expired;

  const handleSelectAction = (nextAction) => {
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
      <Popover.Portal>
        <Popover.Content side="top" align="end" sideOffset={5} className="z-50">
          <OptionWrapper className="static !shadow-200">
            <OptionItem
              as="button"
              type="button"
              className="w-full"
              onClick={() => handleSelectAction("details")}
            >
              Details
            </OptionItem>
            <OptionItem
              as="button"
              type="button"
              className="w-full disabled:cursor-not-allowed disabled:text-textDisabled"
              disabled={isExpired}
              onClick={() => handleSelectAction("assign")}
            >
              Assign
            </OptionItem>
            <OptionItem
              as="button"
              type="button"
              className="w-full disabled:cursor-not-allowed disabled:text-textDisabled"
              disabled={isExpired}
              onClick={() => handleSelectAction("pool")}
            >
              Pool
            </OptionItem>
            <OptionItem
              as="button"
              type="button"
              className="w-full"
              onClick={() => handleSelectAction("transfer")}
            >
              Transfer
            </OptionItem>
            <OptionItem
              as="button"
              type="button"
              className="w-full disabled:cursor-not-allowed disabled:text-textDisabled"
              disabled={region.end - region.begin <= 1}
              onClick={() => handleSelectAction("partition")}
            >
              Partition
            </OptionItem>
            <OptionItem
              as="button"
              type="button"
              className="w-full disabled:cursor-not-allowed disabled:text-textDisabled"
              disabled={region.parts <= 1}
              onClick={() => handleSelectAction("interlace")}
            >
              Interlace
            </OptionItem>
          </OptionWrapper>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
