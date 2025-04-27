import RightWrapper from "next-common/components/rightWraper";
import { useCallback, useMemo } from "react";
import {
  useExtensionAccounts,
  usePopupParams,
} from "../popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "../common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import AddressComboField from "../popup/fields/addressComboField";
import { noop } from "lodash-es";
import SignerWithBalance from "../signerPopup/signerWithBalance";
import { Label } from "../popup/styled";
import Input from "next-common/lib/input";
import { SubsDeposit } from "./content";

export default function RemoveSubPopupContent() {
  const { selectedSub, selectedSubIndex, subs } = usePopupParams();
  const api = useContextApi();
  const dispatch = useDispatch();
  const extensionAccounts = useExtensionAccounts();

  const submitIsDisabled = useMemo(() => {
    return !selectedSub;
  }, [selectedSub]);

  const submitSubsList = useMemo(() => {
    return subs
      .filter((sub, index) => index !== selectedSubIndex)
      .map(([address, name]) => [address, { Raw: name }]);
  }, [subs, selectedSubIndex]);

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity) {
      return;
    }

    return api.tx.identity.setSubs(submitSubsList);
  }, [api, submitSubsList]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Submit subs successfully"));
  }, [dispatch]);

  if (!selectedSub || selectedSubIndex < 0) {
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
        <div className="flex flex-col flex-1">
          <Label>Sub Name</Label>
          <Input className="flex-1" value={selectedSub.subName} readOnly />
        </div>
      </div>

      <SubsDeposit selectedList={submitSubsList} />

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
