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
import { getPartitionDuration } from "./utils";
import RegionSplitPreview from "./splitPreview";

function PopupContent({ region }) {
  const {
    api,
    regionId,
    region: currentRegion,
    error,
  } = useRegionActionState(region, "partition");
  const [inputPivot, setInputPivot] = useState("");
  const inputHintId = useId();
  const end = currentRegion?.end;
  const duration = new BigNumber(end).minus(regionId.begin);
  const canPartition = duration.isFinite() && duration.gt(1);
  const maxTimeslices = duration.minus(1).toNumber().toLocaleString("en-US");
  const pivot =
    canPartition && /^\d+$/.test(inputPivot)
      ? getPartitionDuration(regionId.begin, end, inputPivot)
      : null;
  const hasInvalidPivot = canPartition && inputPivot !== "" && pivot === null;

  let inputHint = error || "Waiting for Coretime data";
  if (canPartition) {
    inputHint = `Enter a whole number from 1 to ${maxTimeslices}.`;
  } else if (duration.isFinite()) {
    inputHint = "This region is too short to partition";
  }
  const disabledReason = error || (pivot === null ? inputHint : null);

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }
    return api.tx.broker.partition(regionId, pivot.toFixed(0));
  }, [api, regionId, pivot, disabledReason]);

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      <Labeled
        text="First region duration"
        tooltip="Number of timeslices from the region start. The remainder forms the second region."
      >
        <Input
          aria-label="First region duration in timeslices"
          aria-describedby={inputHintId}
          aria-invalid={hasInvalidPivot}
          inputMode="numeric"
          value={inputPivot}
          onValueChange={setInputPivot}
          disabled={!canPartition}
          placeholder={canPartition ? `1–${maxTimeslices}` : "Enter timeslices"}
          suffix={<span className="text-textTertiary">timeslices</span>}
          className={cn(
            "[&_input]:min-w-0",
            hasInvalidPivot && "border-red500 hover:border-red500",
          )}
        />
        <p
          id={inputHintId}
          className={cn(
            "mt-2 text12Normal",
            hasInvalidPivot ? "text-red500" : "text-textTertiary",
          )}
        >
          {inputHint}
        </p>
      </Labeled>
      <RegionSplitPreview total={duration} first={pivot} unit="timeslice" />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Partition"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function PartitionPopup({ region, ...props }) {
  return (
    <PopupWithSigner title={`Partition core #${region.core}`} {...props}>
      <PopupContent region={region} />
    </PopupWithSigner>
  );
}
