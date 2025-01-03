import { SystemMore } from "@osn/icons/subsquare";
import { useCanBump } from "next-common/components/collectives/core/actions/bump";
import BumpFellowshipMemberPopup from "next-common/components/collectives/core/actions/bump/popup";
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
import { cn } from "next-common/utils";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

function PromoteMenuItem({ member, setShowPromotePopup, setShowContextMenu }) {
  const { canPromote } = useCanPromote(member);
  const shouldShow = useShouldShowPromoteButton(member);
  if (!shouldShow) {
    return null;
  }

  if (!canPromote) {
    return (
      <OptionItem>
        <span className="text14Medium text-textDisabled">Promote</span>
      </OptionItem>
    );
  }

  return (
    <OptionItem
      onClick={() => {
        setShowPromotePopup(true);
        setShowContextMenu(false);
      }}
    >
      <span className="text14Medium text-textPrimary">Promote</span>
    </OptionItem>
  );
}

function ApproveMenuItem({ member, setShowApprovePopup, setShowContextMenu }) {
  const { canApprove } = useCanApprove(member);
  const shouldShow = useShouldShowApproveButton(member);
  if (!shouldShow) {
    return null;
  }

  if (!canApprove) {
    return (
      <OptionItem>
        <span className="text14Medium text-textDisabled">Approve</span>
      </OptionItem>
    );
  }

  return (
    <OptionItem
      onClick={() => {
        setShowApprovePopup(true);
        setShowContextMenu(false);
      }}
    >
      <span className="text14Medium text-textPrimary">Approve</span>
    </OptionItem>
  );
}

function BumpMenuItem({ member, setShowBumpPopup, setShowContextMenu }) {
  const canBump = useCanBump(member);

  if (!canBump) {
    return (
      <OptionItem>
        <span className="text14Medium text-textDisabled">Bump</span>
      </OptionItem>
    );
  }

  return (
    <OptionItem
      onClick={() => {
        setShowBumpPopup(true);
        setShowContextMenu(false);
      }}
    >
      <span className="text14Medium text-textPrimary">Bump</span>
    </OptionItem>
  );
}

export default function MoreActions({ member }) {
  const { address } = member || {};

  const ref = useRef();
  useClickAway(ref, () => setShowContextMenu(false));
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showBumpPopup, setShowBumpPopup] = useState(false);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [showPromotePopup, setShowPromotePopup] = useState(false);

  return (
    <div className="relative" ref={ref}>
      <div
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
            "z-10 absolute right-0 top-[100%] p-[4px] w-[160px]",
            "rounded-[6px] border border-neutral200",
            "bg-neutral100 shadow-200",
          )}
        >
          <BumpMenuItem
            member={member}
            setShowBumpPopup={setShowBumpPopup}
            setShowContextMenu={setShowContextMenu}
          />
          <ApproveMenuItem
            member={member}
            setShowApprovePopup={setShowApprovePopup}
            setShowContextMenu={setShowContextMenu}
          />
          <PromoteMenuItem
            member={member}
            setShowPromotePopup={setShowPromotePopup}
            setShowContextMenu={setShowContextMenu}
          />
        </div>
      )}
      {showBumpPopup && (
        <BumpFellowshipMemberPopup
          who={address}
          onClose={() => setShowBumpPopup(false)}
        />
      )}
      {showApprovePopup && (
        <ApproveFellowshipMemberPopup
          who={address}
          onClose={() => setShowApprovePopup(false)}
        />
      )}
      {showPromotePopup && (
        <PromoteFellowshipMemberPopup
          who={address}
          onClose={() => setShowPromotePopup(false)}
        />
      )}
    </div>
  );
}
