import { SystemMore } from "@osn/icons/subsquare";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { cn } from "next-common/utils";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

function ActivationItem({ member }) {
  const { isActive } = member.status;

  return (
    <OptionItem>
      <div className="flex items-center">
        <SignalIndicator
          showTooltip={false}
          active={!isActive}
          className="w-6 h-6 mr-2"
        />
        {isActive ? "Unactive" : "Active"}
      </div>
    </OptionItem>
  );
}

export default function More({ member }) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useClickAway(ref, () => {
    setShow(false);
  });

  return (
    <div ref={ref} className="relative">
      <SystemMore
        className={cn(
          "w-5 h-5 text-textTertiary cursor-pointer",
          show && "text-textSecondary",
        )}
        onClick={() => {
          setShow(true);
        }}
      />

      {show && (
        <OptionWrapper>
          <ActivationItem member={member} />
        </OptionWrapper>
      )}
    </div>
  );
}
