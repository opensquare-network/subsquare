import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import RightWrapper from "next-common/components/rightWraper";
import { useCallback, useMemo } from "react";
import LoadableContent from "../common/loadableContent";
import { useExtensionAccounts } from "../popupWithSigner/context";
import CurrencyInput from "../currencyInput";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import useSetSubsDeposit from "next-common/hooks/people/useSetSubsDeposit";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "../common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import AddressComboField from "../popup/fields/addressComboField";
import TextInputField from "../popup/fields/textInputField";
import { noop } from "lodash-es";
import SignerWithBalance from "../signerPopup/signerWithBalance";

export default function RemoveSubPopupContent({ selectedSub }) {
  const api = useContextApi();
  const dispatch = useDispatch();
  const chainSettings = useChainSettings();
  const extensionAccounts = useExtensionAccounts();
  const { deposit, isLoading: isDepositLoading } = useSetSubsDeposit();

  const submitIsDisabled = useMemo(() => {
    return !selectedSub;
  }, [selectedSub]);

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity) {
      return;
    }

    return api.tx.identity.removeSub(selectedSub.address);
  }, [api, selectedSub]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Submit subs successfully"));
  }, [dispatch]);

  if (!selectedSub) {
    return (
      <div className="text-textTertiary text14Medium">
        Please select a sub identity to remove
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SignerWithBalance />

      <div className="flex gap-x-4">
        <AddressComboField
          comboClassName="w-[290px] !rounded-lg"
          size="small"
          extensionAccounts={extensionAccounts}
          defaultAddress={selectedSub.address}
          setAddress={noop}
          readOnly
        />
        <TextInputField
          className="flex-1"
          title="Sub Name"
          text={selectedSub.subName}
          disabled
        />
      </div>

      <AdvanceSettings>
        <CurrencyInput
          disabled
          value={
            isDepositLoading
              ? ""
              : toPrecision(deposit || 0, chainSettings.decimals)
          }
          prefix={<LoadableContent isLoading={isDepositLoading} />}
          symbol={chainSettings.symbol}
        />
      </AdvanceSettings>

      <RightWrapper>
        <TxSubmissionButton
          disabled={submitIsDisabled}
          title="Submit"
          getTxFunc={getTxFunc}
          onInBlock={onInBlock}
        />
      </RightWrapper>
    </div>
  );
}
