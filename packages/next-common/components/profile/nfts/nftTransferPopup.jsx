import { useCallback } from "react";
import { useDispatch } from "react-redux";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { isSameAddress } from "next-common/utils";
import { invalidateNftCollections } from "./useAccountNftCollections";

function PopupContent() {
  const { collectionId, itemId } = usePopupParams();
  const api = useAssetHubApi();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const dispatch = useDispatch();

  const { value: transferToAddress, component: transferToAddressField } =
    useAddressComboField({ title: "To" });

  const getTxFunc = useCallback(() => {
    if (!api) {
      throw new Error("Asset Hub network is not connected yet");
    }

    if (!transferToAddress) {
      throw new Error("Please enter the recipient address");
    }

    if (isSameAddress(transferToAddress, address)) {
      throw new Error("Cannot transfer to self");
    }

    // On-chain call signature: Nfts.transfer(collection, item, dest)
    return api.tx.nfts.transfer(collectionId, itemId, transferToAddress);
  }, [api, transferToAddress, address, collectionId, itemId]);

  const onInBlock = useCallback(() => {
    invalidateNftCollections();
    dispatch(newSuccessToast("Transfer successfully"));
  }, [dispatch]);

  return (
    <>
      <div className="text14Medium text-textSecondary">
        Collection #{collectionId} · Item #{itemId}
      </div>
      <Signer />
      {transferToAddressField}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton
        api={api}
        title="Confirm"
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
      />
    </>
  );
}

export default function NftTransferPopup(props) {
  return (
    <PopupWithSigner title="Transfer NFT" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
