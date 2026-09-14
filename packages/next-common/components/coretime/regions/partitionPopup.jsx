import { useCallback, useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Labeled from "next-common/components/Labeled";
import NumberInput from "next-common/lib/input/number";
import Tooltip from "next-common/components/tooltip";
import useRegionActionState from "./useRegionActionState";
import { getPartitionOffset } from "./utils";

function PopupContent({ region }) {
  const {
    api,
    regionId,
    region: currentRegion,
    error,
  } = useRegionActionState(region, "partition");
  const [inputPercentage, setInputPercentage] = useState("50");
  const end = currentRegion?.end;
  const pivot = getPartitionOffset(regionId.begin, end, inputPercentage);
  const disabledReason =
    error ||
    (end - regionId.begin <= 1
      ? "This region is too short to partition"
      : null) ||
    (pivot === null
      ? "Choose a percentage that leaves at least one timeslice in each region"
      : null);

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }
    return api.tx.broker.partition(regionId, pivot);
  }, [api, regionId, pivot, disabledReason]);

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      <Labeled text="First region percentage">
        <NumberInput
          aria-label="First region percentage"
          value={inputPercentage}
          onValueChange={setInputPercentage}
          allowDecimals
          controls={false}
          min={0}
          max={100}
          suffix="%"
          placeholder="Enter percentage"
        />
      </Labeled>
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
