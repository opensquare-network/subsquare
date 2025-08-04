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
      <div className="inline-flex flex-wrap">
        <span className="mr-2">OpenGov:</span>
        There&nbsp;<span>{confirmingCount > 1 ? "are" : "is"}</span>
        <span className="text14Bold">&nbsp;{confirmingCount}&nbsp;</span>
        referenda confirming{requesting}. &nbsp;
        <span>
          Check {confirmingCount > 1 ? "them" : "it"}
          &nbsp;
          <Link className="inline-block underline text14Bold" href="/referenda">
            here
          </Link>
          .
        </span>
      </div>
      <SystemClose
        className="w-5 h-5 text-theme500 flex-shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}
