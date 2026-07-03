import { SystemClose } from "@osn/icons/subsquare";
import { colorStyle, PromptTypes } from "../../scrollPrompt";
import { GreyPanel } from "../../styled/containers/greyPanel";
import { CACHE_KEY } from "next-common/utils/constants";
import usePromptVisibility from "next-common/hooks/usePromptVisibility";
import { usePendingSpendsFromContext } from "next-common/components/treasury/spends/pendingContext";

function PendingNoticeContent({
  expiringSoonCount,
  validSoonCount,
  claimableCount,
  onClose,
  styleType = PromptTypes.INFO,
}) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[styleType]}
    >
      <div className="flex flex-wrap items-center gap-x-2">
        <span>Treasury Spends:</span>
        <span className="font-bold">{expiringSoonCount}</span>
        <span>will expire within 7 days</span>
        <span>·</span>
        <span className="font-bold">{validSoonCount}</span>
        <span>will become valid within 3 days</span>
        <span>·</span>
        <span className="font-bold">{claimableCount}</span>
        <span>are claimable</span>
      </div>
      <SystemClose
        className="w-5 h-5 flex-shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}

function DisplayPendingNotice({ styleType, onClose }) {
  const { expiringSoonCount, validSoonCount, claimableCount } =
    usePendingSpendsFromContext();
  if (expiringSoonCount === 0 && validSoonCount === 0 && claimableCount === 0) {
    return null;
  }

  return (
    <PendingNoticeContent
      expiringSoonCount={expiringSoonCount}
      validSoonCount={validSoonCount}
      claimableCount={claimableCount}
      styleType={styleType}
      onClose={onClose}
    />
  );
}

export default function TreasurySpendsPendingNotice({ styleType }) {
  const { visible, handleClose } = usePromptVisibility(
    CACHE_KEY.treasurySpendsPendingNotice,
    true,
  );
  if (!visible) {
    return null;
  }

  return <DisplayPendingNotice styleType={styleType} onClose={handleClose} />;
}
