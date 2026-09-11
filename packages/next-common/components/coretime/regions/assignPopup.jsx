import { useCallback, useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Labeled from "next-common/components/Labeled";
import NumberInput from "next-common/lib/input/number";
import Select from "next-common/components/select";
import Tooltip from "next-common/components/tooltip";
import useRegionActionState from "./useRegionActionState";

const MAX_PARA_ID = 2 ** 32 - 1;
const finalityOptions = [
  { value: "Provisional", label: "Provisional" },
  { value: "Final", label: "Final (irreversible)" },
];

function PopupContent({ region }) {
  const { api, regionId, error } = useRegionActionState(region, "assign");
  const [inputTaskId, setInputTaskId] = useState("");
  const [finality, setFinality] = useState("Provisional");
  const isValidTaskId =
    /^\d+$/.test(inputTaskId) && Number(inputTaskId) <= MAX_PARA_ID;
  const disabledReason =
    error || (!isValidTaskId ? "Please input a valid Para ID" : null);

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }
    return api.tx.broker.assign(regionId, Number(inputTaskId), finality);
  }, [api, regionId, inputTaskId, finality, disabledReason]);

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      <Labeled text="Para ID">
        <NumberInput
          aria-label="Para ID"
          value={inputTaskId}
          onValueChange={setInputTaskId}
          controls={false}
          max={MAX_PARA_ID}
          placeholder="Enter Para ID"
        />
      </Labeled>
      <Labeled text="Finality">
        <Select
          value={finality}
          options={finalityOptions}
          onChange={({ value }) => setFinality(value)}
        />
      </Labeled>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Assign"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function AssignPopup({ region, ...props }) {
  return (
    <PopupWithSigner title={`Assign core #${region.core}`} {...props}>
      <PopupContent region={region} />
    </PopupWithSigner>
  );
}
