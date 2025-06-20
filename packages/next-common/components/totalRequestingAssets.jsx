import { SystemClose } from "@osn/icons/subsquare";
import { colorStyle, PromptTypes } from "./scrollPrompt";
import { GreyPanel } from "./styled/containers/greyPanel";
import { CACHE_KEY } from "next-common/utils/constants";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "./valueDisplay";
import usePromptVisibility from "next-common/hooks/usePromptVisibility";
import useTreasuryRequesting from "next-common/hooks/useTreasuryRequesting";

function DisplayTotalRequestingAssets({ onClose }) {
  const { requestingValue, confirmingValue } = useTreasuryRequesting();

  if (!confirmingValue || !requestingValue) return null;

  if (confirmingValue?.isZero() && requestingValue?.isZero()) {
    return null;
  }

  return (
    <TotalRequestingAssetsContent
      confirmingValue={confirmingValue}
      requestingValue={requestingValue}
      onClose={onClose}
    />
  );
}

export default function TotalRequestingAssets() {
  const { modules } = useChainSettings();
  const { visible, handleClose } = usePromptVisibility(
    CACHE_KEY.totalRequestingAssets,
    true,
  );

  if (!visible || !modules?.referenda?.displayTreasuryRequesting) return null;

  return <DisplayTotalRequestingAssets onClose={handleClose} />;
}

function TotalRequestingAssetsContent({
  confirmingValue,
  requestingValue,
  onClose,
}) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes.INFO]}
    >
      <div className="flex flex-wrap items-center gap-x-2">
        <span>Treasury Requesting:</span>
        <span>Confirming</span>
        <ValueDisplay
          className="font-bold"
          value={confirmingValue}
          symbol={""}
          prefix={"$"}
        />
        {requestingValue?.gt(0) && (
          <>
            <span>·</span>
            <span>Requesting</span>
            <ValueDisplay
              className="font-bold"
              value={requestingValue}
              symbol={""}
              prefix={"$"}
            />
          </>
        )}
      </div>
      <SystemClose
        className="w-5 h-5 flex-shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}
