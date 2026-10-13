import { useState } from "react";
import { isNil } from "lodash-es";
import * as Popover from "@radix-ui/react-popover";
import { SystemMore } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { RegionStatus } from "next-common/components/coretime/regions/utils";

const ClaimRevenuePopup = dynamicPopup(() => import("./claimRevenuePopup"));
const DropContributionPopup = dynamicPopup(() =>
  import("./dropContributionPopup"),
);

export default function ContributionActionColumn({
  contribution,
  lastTimeslice,
  contributionTimeout,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  // A contribution can only be dropped once the contribution plus the
  // contribution timeout has passed.
  const canDrop =
    contribution.status === RegionStatus.Expired &&
    !isNil(lastTimeslice) &&
    !isNil(contributionTimeout) &&
    lastTimeslice >=
      contribution.begin + contribution.length + contributionTimeout;

  const handleSelectAction = (action) => {
    setIsMenuOpen(false);
    setActiveAction(action);
  };

  return (
    <>
      <Popover.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Popover.Trigger asChild>
          <SecondaryButton
            type="button"
            aria-label="Pool contribution actions"
            className="w-7 h-7 p-0"
          >
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
                onClick={() => handleSelectAction("claim")}
              >
                Claim revenue
              </OptionItem>
              <OptionItem
                as="button"
                type="button"
                disabled={!canDrop}
                className="w-full disabled:cursor-not-allowed disabled:text-textDisabled"
                onClick={() => handleSelectAction("drop")}
              >
                Drop contribution
              </OptionItem>
            </OptionWrapper>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {activeAction === "claim" && (
        <ClaimRevenuePopup
          contribution={contribution}
          onClose={() => setActiveAction(null)}
        />
      )}
      {activeAction === "drop" && (
        <DropContributionPopup
          contribution={contribution}
          canDrop={canDrop}
          onClose={() => setActiveAction(null)}
        />
      )}
    </>
  );
}
