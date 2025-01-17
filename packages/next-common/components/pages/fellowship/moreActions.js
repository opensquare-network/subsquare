import { SystemMore } from "@osn/icons/subsquare";
import { useCanBump } from "next-common/components/collectives/core/actions/bump";
import BumpFellowshipMemberPopup from "next-common/components/collectives/core/actions/bump/popup";
import ActivationPopup from "next-common/components/collectives/core/actions/more/activationItem/popup";
import SubmitEvidencePopup from "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup";
import {
  useCanApprove,
  useShouldShowApproveButton,
} from "next-common/components/fellowship/core/members/actions/approve";
import ApproveFellowshipMemberPopup from "next-common/components/fellowship/core/members/actions/approve/popup";
import {
  useCanPromote,
  useShouldShowPromoteButton,
} from "next-common/components/fellowship/core/members/actions/promote";
import PromoteFellowshipMemberPopup from "next-common/components/fellowship/core/members/actions/promote/popup";
import { OptionItem } from "next-common/components/internalDropdown/styled";
import Tooltip from "next-common/components/tooltip";
import { useContainerRef } from "next-common/context/containerRef";
import useIsElementInLowerHalf from "next-common/hooks/useIsElementInLowerHalf";
import Button from "next-common/lib/button";
import { cn, isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { createContext, useContext, useRef, useState } from "react";
import { useClickAway } from "react-use";

export const ContextMenuStateContext = createContext();

export function useIsMe(address) {
  const realAddress = useRealAddress();
  return isSameAddress(address, realAddress);
}

export function PromoteMenuItem({ member, params, setShowPromotePopup }) {
  const { setShowContextMenu } = useContext(ContextMenuStateContext);
  const { canPromote, reason } = useCanPromote(member, params);
  const shouldShow = useShouldShowPromoteButton(member);
  if (!shouldShow) {
    return null;
  }

  if (!canPromote) {
    return (
      <OptionItem>
        <Tooltip className="w-full text-left" content={reason}>
          <span className="text14Medium text-textDisabled">Promote</span>
        </Tooltip>
      </OptionItem>
    );
  }

  return (
    <OptionItem
      role="button"
      onClick={() => {
        setShowPromotePopup(true);
        setShowContextMenu(false);
      }}
    >
      <span className="text14Medium text-textPrimary">Promote</span>
    </OptionItem>
  );
}

export function ApproveMenuItem({ member, setShowApprovePopup }) {
  const { setShowContextMenu } = useContext(ContextMenuStateContext);
  const { canApprove, reason } = useCanApprove(member);
  const shouldShow = useShouldShowApproveButton(member);
  if (!shouldShow) {
    return null;
  }

  if (!canApprove) {
    return (
      <OptionItem>
        <Tooltip className="w-full text-left" content={reason}>
          <span className="text14Medium text-textDisabled">Approve</span>
        </Tooltip>
      </OptionItem>
    );
  }

  return (
    <OptionItem
      role="button"
      onClick={() => {
        setShowApprovePopup(true);
        setShowContextMenu(false);
      }}
    >
      <span className="text14Medium text-textPrimary">Approve</span>
    </OptionItem>
  );
}

export function BumpMenuItem({ member, setShowBumpPopup }) {
  const { setShowContextMenu } = useContext(ContextMenuStateContext);
  const canBump = useCanBump(member);
  const { rank } = member || {};

  return (
    <OptionItem
      onClick={() => {
        if (!canBump) {
          return;
        }

        setShowBumpPopup(true);
        setShowContextMenu(false);
      }}
    >
      <Button
        className={`border-0 p-0 h-auto ${
          canBump ? "text-theme500" : "text-textDisabled"
        }`}
        disabled={!canBump}
      >
        {rank <= 0 ? "Offboard" : "Demote"}
      </Button>
    </OptionItem>
  );
}

export function SubmitEvidenceMenuItem({ member, setShowSubmitEvidencePopup }) {
  const { setShowContextMenu } = useContext(ContextMenuStateContext);
  const isMe = useIsMe(member.address);
  if (!isMe) {
    return null;
  }

  return (
    <OptionItem
      role="button"
      onClick={() => {
        setShowSubmitEvidencePopup(true);
        setShowContextMenu(false);
      }}
    >
      <span className="text14Medium text-textPrimary whitespace-nowrap">
        Submit Evidence
      </span>
    </OptionItem>
  );
}

export function ActivationMenuItem({ member, setShowActivationPopup }) {
  const { setShowContextMenu } = useContext(ContextMenuStateContext);
  const isMe = useIsMe(member.address);
  const { isActive } = member.status;

  if (!isMe) {
    return null;
  }

  return (
    <OptionItem
      role="button"
      onClick={() => {
        setShowActivationPopup(true);
        setShowContextMenu(false);
      }}
    >
      {isActive ? "Inactive" : "Active"}
    </OptionItem>
  );
}

export function MoreActionsWrapper({ children }) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const ref = useRef();
  useClickAway(ref, () => setShowContextMenu(false));
  const dataListRef = useContainerRef();
  const isInLowerHalf = useIsElementInLowerHalf(ref, dataListRef);

  return (
    <ContextMenuStateContext.Provider
      value={{ showContextMenu, setShowContextMenu }}
    >
      <div className="relative" ref={ref}>
        <div
          role="button"
          className={cn(
            "inline-flex p-[6px] cursor-pointer",
            "rounded-[4px] border-neutral400 border",
          )}
          onClick={() => setShowContextMenu(true)}
        >
          <SystemMore className="w-[16px] h-[16px]" />
        </div>
        {showContextMenu && (
          <div
            className={cn(
              "z-10 absolute right-0 p-[4px] w-[160px]",
              isInLowerHalf
                ? "bottom-[calc(100%+6px)]"
                : "top-[calc(100%+6px)]",
              "rounded-[6px] border border-neutral200",
              "bg-neutral100 shadow-200",
            )}
          >
            {children}
          </div>
        )}
      </div>
    </ContextMenuStateContext.Provider>
  );
}

export default function MoreActions({ member, params }) {
  const { address, rank } = member || {};

  const [showBumpPopup, setShowBumpPopup] = useState(false);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [showPromotePopup, setShowPromotePopup] = useState(false);
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);
  const [showActivationPopup, setShowActivationPopup] = useState(false);

  return (
    <>
      <MoreActionsWrapper>
        <ApproveMenuItem
          member={member}
          setShowApprovePopup={setShowApprovePopup}
        />
        <PromoteMenuItem
          member={member}
          params={params}
          setShowPromotePopup={setShowPromotePopup}
        />
        <SubmitEvidenceMenuItem
          member={member}
          setShowSubmitEvidencePopup={setShowSubmitEvidencePopup}
        />
        <ActivationMenuItem
          member={member}
          setShowActivationPopup={setShowActivationPopup}
        />
        <BumpMenuItem member={member} setShowBumpPopup={setShowBumpPopup} />
      </MoreActionsWrapper>
      {showBumpPopup && (
        <BumpFellowshipMemberPopup
          who={address}
          isCandidate={rank <= 0}
          onClose={() => setShowBumpPopup(false)}
        />
      )}
      {showApprovePopup && (
        <ApproveFellowshipMemberPopup
          member={member}
          onClose={() => setShowApprovePopup(false)}
        />
      )}
      {showPromotePopup && (
        <PromoteFellowshipMemberPopup
          member={member}
          onClose={() => setShowPromotePopup(false)}
        />
      )}
      {showActivationPopup && (
        <ActivationPopup
          member={member}
          who={member.address}
          onClose={() => {
            setShowActivationPopup(false);
          }}
        />
      )}
      {showSubmitEvidencePopup && (
        <SubmitEvidencePopup
          onClose={() => {
            setShowSubmitEvidencePopup(false);
          }}
        />
      )}
    </>
  );
}
