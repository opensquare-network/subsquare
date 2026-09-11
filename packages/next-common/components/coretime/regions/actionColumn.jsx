import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { SystemMore } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { RegionStatus } from "./utils";

const RegionDetailPopup = dynamicPopup(() => import("./detailPopup"));
const AssignPopup = dynamicPopup(() => import("./assignPopup"));
const PoolPopup = dynamicPopup(() => import("./poolPopup"));
const TransferPopup = dynamicPopup(() => import("./transferPopup"));

export default function RegionActionColumn({ region }) {
  const [action, setAction] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isExpired = region.status === RegionStatus.Expired;

  const handleSelectAction = (nextAction) => {
    setIsMenuOpen(false);
    setAction(nextAction);
  };

  return (
    <>
      <Popover.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Popover.Trigger asChild>
          <SecondaryButton aria-label="Region actions" className="w-7 h-7 p-0">
            <SystemMore className="w-4 h-4" />
          </SecondaryButton>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side="top"
            align="end"
            sideOffset={5}
            className="z-50"
          >
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
            </OptionWrapper>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {action === "details" && (
        <RegionDetailPopup region={region} onClose={() => setAction(null)} />
      )}
      {action === "assign" && (
        <AssignPopup region={region} onClose={() => setAction(null)} />
      )}
      {action === "pool" && (
        <PoolPopup region={region} onClose={() => setAction(null)} />
      )}
      {action === "transfer" && (
        <TransferPopup region={region} onClose={() => setAction(null)} />
      )}
    </>
  );
}
