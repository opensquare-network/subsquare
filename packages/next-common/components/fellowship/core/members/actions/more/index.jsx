import { SystemMore } from "@osn/icons/subsquare";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { cn } from "next-common/utils";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import ActivationItem from "./activationItem";
import ActivationPopup from "./activationItem/popup";

export default function More({ member }) {
  const ref = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showActivationPopup, setShowActivationPopup] = useState(false);

  useClickAway(ref, hideMenu);

  function hideMenu() {
    setShowMenu(false);
  }

  return (
    <div ref={ref} className="relative">
      <SystemMore
        className={cn(
          "w-5 h-5 text-textTertiary cursor-pointer",
          showMenu && "text-textSecondary",
        )}
        onClick={() => {
          setShowMenu(true);
        }}
      />

      {showMenu && (
        <OptionWrapper>
          <ActivationItem
            member={member}
            onClick={() => {
              setShowActivationPopup(true);
              hideMenu();
            }}
          />
        </OptionWrapper>
      )}

      {showActivationPopup && (
        <ActivationPopup
          member={member}
          onClose={() => {
            setShowActivationPopup(false);
          }}
        />
      )}
    </div>
  );
}
