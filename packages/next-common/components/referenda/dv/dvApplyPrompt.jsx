import { SystemDv, SystemClose } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import usePromptVisibility from "next-common/hooks/usePromptVisibility";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";
import { CACHE_KEY } from "next-common/utils/constants";

function CloseButton({ className = "", onClick = noop }) {
  return (
    <SystemClose
      role="button"
      className={cn("w-5 h-5", className)}
      style={{
        color: "var(--textSecondary)",
      }}
      onClick={onClick}
    />
  );
}

export default function DVApplyPrompt() {
  const { visible, handleClose } = usePromptVisibility(
    CACHE_KEY.dvApplyPromptVisible,
    true,
  );

  if (!visible) return null;

  return (
    <NeutralPanel className="flex items-center gap-3 p-6 max-sm:flex-col max-sm:items-start">
      <div className="max-sm:flex-1 max-sm:flex max-sm:justify-between max-sm:items-start max-sm:w-full">
        <div className="flex items-center justify-center w-10 h-10 bg-theme100 rounded-lg">
          <SystemDv />
        </div>
        <CloseButton className="max-sm:block hidden" onClick={handleClose} />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text14Bold text-textPrimary">
          Decentralized Voices Program
        </span>
        <span className="text14Medium text-textTertiary">
          To empower broader community participation and amplify the voices of
          passionate and knowledgeable participants.
        </span>
      </div>
      <div className="flex justify-end items-center gap-2">
        <SecondaryButton>Apply</SecondaryButton>
        <CloseButton className="max-sm:hidden" onClick={handleClose} />
      </div>
    </NeutralPanel>
  );
}
