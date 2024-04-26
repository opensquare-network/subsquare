import { SystemMore } from "@osn/icons/subsquare";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { cn } from "next-common/utils";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import ActivationItem from "./activationItem";

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
          <OptionItem>
            <ActivationItem member={member} rootRef={ref} />
          </OptionItem>
        </OptionWrapper>
      )}
    </div>
  );
}
