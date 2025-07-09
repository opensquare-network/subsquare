import { SystemClose } from "@osn/icons/subsquare";
import { colorStyle, PromptTypes } from "./scrollPrompt";
import { GreyPanel } from "./styled/containers/greyPanel";
import { CACHE_KEY } from "next-common/utils/constants";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "./valueDisplay";
import usePromptVisibility from "next-common/hooks/usePromptVisibility";
import useTreasuryRequesting from "next-common/hooks/useTreasuryRequesting";
import Link from "next/link";

function DisplayTotalRequestingAssets({ styleType, onClose }) {
  const { requestingValue, confirmingValue } = useTreasuryRequesting();

  if (!confirmingValue || !requestingValue) return null;

  if (confirmingValue?.isZero() && requestingValue?.isZero()) {
    return null;
  }

  return (
    <TotalRequestingAssetsContent
      confirmingValue={confirmingValue}
      requestingValue={requestingValue}
      styleType={styleType}
      onClose={onClose}
    />
  );
}

export default function TotalRequestingAssets({ styleType }) {
  const { modules } = useChainSettings();
  const { visible, handleClose } = usePromptVisibility(
    CACHE_KEY.totalRequestingAssets,
    true,
  );

  if (!visible || !modules?.referenda?.displayTreasuryRequesting) return null;

  return (
    <DisplayTotalRequestingAssets styleType={styleType} onClose={handleClose} />
  );
}

function TotalRequestingAssetsContent({
  confirmingValue,
  requestingValue,
  onClose,
  styleType = PromptTypes.INFO,
}) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[styleType]}
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
        <RequestingContent requestingValue={requestingValue} />
        <RelatedReferenda />
      </div>
      <SystemClose
        className="w-5 h-5 flex-shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}

function RequestingContent({ requestingValue }) {
  if (!requestingValue || requestingValue?.isZero()) {
    return null;
  }

  return (
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
  );
}

function RelatedReferenda() {
  const queryParams = {
    is_treasury: true,
    ongoing: true,
  };

  const queryString = new URLSearchParams(queryParams).toString();

  return (
    <>
      <span>·</span>
      <span>
        <Link
          className="font-bold underline"
          href={`/referenda?${queryString}`}
        >
          Check all
        </Link>
        .
      </span>
    </>
  );
}
