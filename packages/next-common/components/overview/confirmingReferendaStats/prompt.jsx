import { SystemClose } from "@osn/icons/subsquare";
import Link from "next/link";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

export default function Prompt({
  onClose,
  confirmingCount,
  requesting = null,
}) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes.INFO]}
    >
      <div className="inline-flex">
        <span className="mr-2">OpenGov:</span>
        <span>There&nbsp;{confirmingCount > 1 ? "are" : "is"}</span>
        <span className="text14Bold">&nbsp;{confirmingCount}&nbsp;</span>
        <span>
          referenda confirming{requesting}. Check{" "}
          {confirmingCount > 1 ? "them" : "it"}
          &nbsp;
        </span>
        <Link className="underline text14Bold" href="/referenda">
          here
        </Link>
        <span>.</span>
      </div>
      <SystemClose
        className="w-5 h-5 text-theme500"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}
