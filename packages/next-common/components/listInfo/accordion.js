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
    <div>
      <TitleContainer className="pt-6">
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

      <div className={clsx(!open && "hidden", "p-6 mt-6")}>
        <div>{children}</div>
      </div>
    </div>
  );
}
