import { useCallback, useState } from "react";
import { isAddress } from "@polkadot/util-crypto";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Labeled from "next-common/components/Labeled";
import Select from "next-common/components/select";
import Tooltip from "next-common/components/tooltip";
import useRegionActionState from "./useRegionActionState";

const finalityOptions = [
  { value: "Provisional", label: "Provisional" },
  { value: "Final", label: "Final (irreversible)" },
];

function PopupContent({ region }) {
  const { api, regionId, error } = useRegionActionState(region, "pool");
  const { value: payee, component: payeeField } = useAddressComboField({
    title: "Payee",
    defaultAddress: region.owner || "",
  });
  const [finality, setFinality] = useState("Provisional");
  const disabledReason =
    error || (!isAddress(payee) ? "Please input a valid payee address" : null);

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }
    return api.tx.broker.pool(regionId, payee, finality);
  }, [api, regionId, payee, finality, disabledReason]);

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      {payeeField}
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
            title="Pool"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function PoolPopup({ region, ...props }) {
  return (
    <PopupWithSigner title={`Pool core #${region.core}`} {...props}>
      <PopupContent region={region} />
    </PopupWithSigner>
  );
}
