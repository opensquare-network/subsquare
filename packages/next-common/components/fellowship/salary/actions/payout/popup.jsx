import React, { useCallback, useState } from "react";
import Tab from "next-common/components/tab";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Beneficiary from "next-common/components/treasury/common/beneficiary";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

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

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }
    return api.tx.fellowshipSalary?.payout();
  }, [api]);

  return (
    <>
      <Signer title="Origin" />
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFunc}
        onClose={onClose}
      />
    </>
  );
}

function OtherPayout() {
  const { onClose } = usePopupParams();
  const [beneficiary, setBeneficiary] = useState("");
  const extensionAccounts = useExtensionAccounts();
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    if (!api && !beneficiary) {
      return;
    }
    return api.tx.fellowshipSalary?.payoutOther(beneficiary);
  }, [api, beneficiary]);

  return (
    <>
      <Signer title="Origin" />
      <Beneficiary
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
      />
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFunc}
        onClose={onClose}
      />
    </>
  );
}

export default function SalaryPayoutModal({ onClose }) {
  const [tabId, setTabId] = useState("myself");

  return (
    <PopupWithSigner title="Payout to" onClose={onClose}>
      <Tab selectedTabId={tabId} setSelectedTabId={setTabId} tabs={tabs} />
      {tabId === "myself" ? <SelfPayout /> : <OtherPayout />}
    </PopupWithSigner>
  );
}