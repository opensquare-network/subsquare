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
import { CoreTimeTypes } from "../hooks/useAllCoreBrokers";
import useRenewState from "../../renew/useRenewState";

const CoreDetailPopup = dynamicPopup(() => import("../popup/detailPopup"));
const RenewPopup = dynamicPopup(() => import("../../renew/popup"));

export default function ActionColumn({ item }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [selectedRenewal, setSelectedRenewal] = useState(null);
  const hasWorkplans = !isNil(item.workplans) && item.workplans.length > 0;

  const handleSelectAction = (action, renewal) => {
    setIsMenuOpen(false);
    setActiveAction(action);
    setSelectedRenewal(renewal);
  };

  return (
    <>
      <Popover.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Popover.Trigger asChild>
          <SecondaryButton
            type="button"
            aria-label="Core actions"
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
                className="w-full disabled:cursor-not-allowed disabled:text-textDisabled"
                disabled={!hasWorkplans}
                onClick={() => handleSelectAction("plans")}
              >
                Plans
              </OptionItem>
              <RenewOption
                item={item}
                onSelect={(renewal) => handleSelectAction("renew", renewal)}
              />
            </OptionWrapper>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {activeAction === "plans" && (
        <CoreDetailPopup core={item} onClose={() => setActiveAction(null)} />
      )}
      {activeAction === "renew" && (
        <RenewPopup
          core={item.coreIndex}
          renewal={selectedRenewal}
          onClose={() => setActiveAction(null)}
        />
      )}
    </>
  );
}

function RenewOption({ item, onSelect }) {
  if (!item.isTask || item.occupancyType !== CoreTimeTypes.BulkCoretime) {
    return null;
  }

  return <RenewOptionContent core={item.coreIndex} onSelect={onSelect} />;
}

function RenewOptionContent({ core, onSelect }) {
  const renewal = useRenewState(core);

  if (!renewal) {
    return null;
  }

  return (
    <OptionItem
      as="button"
      type="button"
      className="w-full"
      onClick={() => onSelect(renewal)}
    >
      Renew
    </OptionItem>
  );
}
