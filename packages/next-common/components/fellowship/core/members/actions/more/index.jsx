import { SystemMore } from "@osn/icons/subsquare";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { cn } from "next-common/utils";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import ActivationItem from "./activationItem";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SubmitEvidenceItem from "./submitEvidenceItem";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SubmitEvidencePopup = dynamicPopup(() =>
  import("./submitEvidenceItem/popup"),
);

const ActivationPopup = dynamicPopup(() => import("./activationItem/popup"));

export default function More({ member }) {
  const realAddress = useRealAddress();
  const ref = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showActivationPopup, setShowActivationPopup] = useState(false);
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);

  const isMe = member.address === realAddress;

  useClickAway(ref, hideMenu);

  function hideMenu() {
    setShowMenu(false);
  }

  if (!isMe) {
    return null;
  }

  return (
    <div ref={ref} className="relative">
      <SystemMore
        className={cn(
          "w-5 h-5 text-textTertiary cursor-pointer",
          "hover:text-textSecondary",
          showMenu && "text-textSecondary",
        )}
        onClick={() => {
          setShowMenu(true);
        }}
      />

      {showMenu && (
        <OptionWrapper className="w-[200px]">
          <ActivationItem
            member={member}
            onClick={() => {
              setShowActivationPopup(true);
              hideMenu();
            }}
          />
          <SubmitEvidenceItem
            member={member}
            onClick={() => {
              setShowSubmitEvidencePopup(true);
              hideMenu();
            }}
          />
        </OptionWrapper>
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
    </div>
  );
}
