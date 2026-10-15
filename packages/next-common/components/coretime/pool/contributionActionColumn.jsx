import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { SystemMore } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";

const ClaimRevenuePopup = dynamicPopup(() => import("./claimRevenuePopup"));

export default function ContributionActionColumn({ contribution }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);

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
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsClaimOpen(true);
                }}
              >
                Claim revenue
              </OptionItem>
            </OptionWrapper>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {isClaimOpen && (
        <ClaimRevenuePopup
          contribution={contribution}
          onClose={() => setIsClaimOpen(false)}
        />
      )}
    </>
  );
}
