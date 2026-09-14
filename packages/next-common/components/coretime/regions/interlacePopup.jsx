import { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Labeled from "next-common/components/Labeled";
import NumberInput from "next-common/lib/input/number";
import Tooltip from "next-common/components/tooltip";
import useRegionActionState from "./useRegionActionState";
import { countRegionMaskBits, createInterlaceMask } from "./utils";

function PopupContent({ region }) {
  const { api, regionId, error } = useRegionActionState(region, "interlace");
  const parts = countRegionMaskBits(regionId.mask);
  const maxParts = parts - 1;
  const [inputParts, setInputParts] = useState(() =>
    new BigNumber(parts).dividedBy(2).toFixed(0, BigNumber.ROUND_DOWN),
  );
  const pivot = createInterlaceMask(regionId.mask, inputParts);
  const disabledReason =
    error ||
    (parts <= 1 ? "This region has too few parts to interlace" : null) ||
    (pivot === null ? `Choose between 1 and ${maxParts} parts` : null);

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }
    return api.tx.broker.interlace(regionId, pivot);
  }, [api, regionId, pivot, disabledReason]);

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      <Labeled text="First region parts">
        <NumberInput
          aria-label="First region parts"
          value={inputParts}
          onValueChange={setInputParts}
          controls={false}
          min={1}
          max={maxParts}
          placeholder={`1–${maxParts}`}
        />
      </Labeled>
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
