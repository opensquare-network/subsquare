import React, { useCallback, useState } from "react";
import Tab from "next-common/components/tab";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Beneficiary from "next-common/components/popupWithSigner/fields/beneficiary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";

const tabs = [
  {
    tabId: "myself",
    tabTitle: "Myself",
  },
  {
    tabId: "other",
    tabTitle: "Other",
  },
];

function SelfPayout() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const pallet = useSalaryFellowshipPallet();

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }
    return api.tx[pallet]?.payout();
  }, [api, pallet]);

  return (
    <>
      <Signer />
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFunc}
        onClose={onClose}
      />
    </>
  );
}

function OtherPayout() {
  const dispatch = useDispatch();
  const { onClose } = usePopupParams();
  const [beneficiary, setBeneficiary] = useState("");
  const api = useContextApi();
  const pallet = useSalaryFellowshipPallet();

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }
    if (!beneficiary) {
      dispatch(newErrorToast("Beneficiary is not specified"));
      return;
    }
    return api.tx[pallet]?.payoutOther(beneficiary);
  }, [api, dispatch, beneficiary, pallet]);

  return (
    <>
      <Signer />
      <Beneficiary setAddress={setBeneficiary} />
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFunc}
        onClose={onClose}
      />
    </>
  );
}

export default function FellowshipSalaryPayoutPopup({ onClose }) {
  const [tabId, setTabId] = useState("myself");

  return (
    <PopupWithSigner title="Payout to" className="!w-[640px]" onClose={onClose}>
      <Tab selectedTabId={tabId} setSelectedTabId={setTabId} tabs={tabs} />
      {tabId === "myself" ? <SelfPayout /> : <OtherPayout />}
    </PopupWithSigner>
  );
}
