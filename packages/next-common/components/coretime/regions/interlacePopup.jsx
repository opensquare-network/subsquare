import { useCallback, useId, useState } from "react";
import BigNumber from "bignumber.js";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Labeled from "next-common/components/Labeled";
import Input from "next-common/lib/input";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import useRegionActionState from "./useRegionActionState";
import { countRegionMaskBits, createInterlaceMask } from "./utils";
import RegionSplitPreview from "./splitPreview";

function PopupContent({ region }) {
  const { api, regionId, error } = useRegionActionState(region, "interlace");
  const parts = countRegionMaskBits(regionId.mask);
  const maxParts = parts - 1;
  const canInterlace = parts > 1;
  const [inputParts, setInputParts] = useState("");
  const inputHintId = useId();
  const pivot = /^\d+$/.test(inputParts)
    ? createInterlaceMask(regionId.mask, inputParts)
    : null;
  const firstParts = pivot === null ? null : new BigNumber(inputParts);
  const hasInvalidParts = canInterlace && inputParts !== "" && pivot === null;
  const inputHint = canInterlace
    ? `Enter a whole number from 1 to ${maxParts}.`
    : "This region has too few parts to interlace";
  const disabledReason = error || (pivot === null ? inputHint : null);

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }
    return api.tx.broker.interlace(regionId, pivot);
  }, [api, regionId, pivot, disabledReason]);

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      <Labeled
        text="First region workload"
        tooltip="Number of workload parts for the first region. The remainder forms the second region."
      >
        <Input
          aria-label="First region workload in parts"
          aria-describedby={inputHintId}
          aria-invalid={hasInvalidParts}
          inputMode="numeric"
          value={inputParts}
          onValueChange={setInputParts}
          disabled={!canInterlace}
          placeholder={canInterlace ? `1–${maxParts}` : "Enter parts"}
          suffix={<span className="text-textTertiary">parts</span>}
          className={cn(
            "[&_input]:min-w-0",
            hasInvalidParts && "border-red500 hover:border-red500",
          )}
        />
        <p
          id={inputHintId}
          className={cn(
            "mt-2 text12Normal",
            hasInvalidParts ? "text-red500" : "text-textTertiary",
          )}
        >
          {inputHint}
        </p>
      </Labeled>
      <RegionSplitPreview total={parts} first={firstParts} unit="part" />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Interlace"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function InterlacePopup({ region, ...props }) {
  return (
    <PopupWithSigner title={`Interlace core #${region.core}`} {...props}>
      <PopupContent region={region} />
    </PopupWithSigner>
  );
}
