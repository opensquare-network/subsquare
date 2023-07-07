import { ArrowUp } from "@osn/icons/subsquare";
import clsx from "clsx";
import { useState } from "react";
import { TitleContainer } from "../styled/containers/titleContainer";

export default function Accordion({
  children,
  title = "",
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="py-6">
      <TitleContainer>
        {title}
        <ArrowUp
          role="button"
          className={clsx(
            "[&_path]:stroke-textTertiary",
            !open && "rotate-180",
          )}
          onClick={() => setOpen((v) => !v)}
        />
      </TitleContainer>

      <div
        className={clsx(
          !open && "hidden",
          "border border-neutral300 shadow-100 rounded-3xl p-6 mt-6",
        )}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}
