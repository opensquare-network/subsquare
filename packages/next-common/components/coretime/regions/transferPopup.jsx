import { useCallback } from "react";
import { isAddress } from "@polkadot/util-crypto";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Tooltip from "next-common/components/tooltip";
import useRegionActionState from "./useRegionActionState";

function PopupContent({ region }) {
  const { api, regionId, error } = useRegionActionState(region, "transfer");
  const { value: newOwner, component: newOwnerField } = useAddressComboField({
    title: "New owner",
  });
  const disabledReason =
    error ||
    (!isAddress(newOwner) ? "Please input a valid recipient address" : null);

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }
    return api.tx.broker.transfer(regionId, newOwner);
  }, [api, regionId, newOwner, disabledReason]);

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      {newOwnerField}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Transfer"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function TransferPopup({ region, ...props }) {
  return (
    <PopupWithSigner title={`Transfer core #${region.core}`} {...props}>
      <PopupContent region={region} />
    </PopupWithSigner>
  );
}
