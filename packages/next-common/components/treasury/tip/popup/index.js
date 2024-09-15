import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue, isAddressInGroup } from "next-common/utils";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Beneficiary from "next-common/components/popupWithSigner/fields/beneficiary";
import TipReason from "./tipReason";
import Tab, { NewTip, ReportAwesome } from "./tab";
import TipValue from "./tipValue";
import { getEventData } from "next-common/utils/sendTransaction";
import { useChainSettings } from "next-common/context/chain";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useRouter } from "next/router";
import { useContextApi } from "next-common/context/api";
import { WarningMessage } from "next-common/components/popup/styled";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";

function TipCommon({ setBeneficiary, setReason }) {
  return (
    <>
      <SignerWithBalance />
      <Beneficiary setAddress={setBeneficiary} />
      <TipReason setValue={setReason} />
    </>
  );
}

function ReportAwesomeContent({
  setBeneficiary,
  setReason,
  getTxFunc,
  onInBlock,
}) {
  return (
    <>
      <TipCommon setBeneficiary={setBeneficiary} setReason={setReason} />
      <TxSubmissionButton getTxFunc={getTxFunc} onInBlock={onInBlock} />
    </>
  );
}

function NewTipContent({
  setBeneficiary,
  setReason,
  setInputValue,
  getTxFunc,
  onInBlock,
}) {
  const signerAccount = useSignerAccount();
  const { members } = useCollectiveMembers();
  const isTipper = isAddressInGroup(signerAccount?.realAddress, members || []);
  return (
    <>
      <WarningMessage danger={!isTipper}>
        Only council members can create new tip.
      </WarningMessage>
      <TipCommon setBeneficiary={setBeneficiary} setReason={setReason} />
      <TipValue setValue={setInputValue} />
      <TxSubmissionButton
        disabled={!isTipper}
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
      />
    </>
  );
}

function PopupContent() {
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");
  const [tabIndex, setTabIndex] = useState(ReportAwesome);
  const [inputValue, setInputValue] = useState("0");
  const { decimals } = useChainSettings();
  const api = useContextApi();
  const router = useRouter();

  const [beneficiary, setBeneficiary] = useState();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const getTxFunc = useCallback(async () => {
    if (!beneficiary) {
      showErrorToast("Please input a beneficiary");
      return;
    }

    if (!reason) {
      showErrorToast("Please input a reason");
      return;
    }

    let tx;

    if (tabIndex === NewTip) {
      let bnValue;
      try {
        bnValue = checkInputValue(inputValue, decimals, "tip value");
      } catch (err) {
        showErrorToast(err.message);
        return;
      }

      tx = api.tx.tips.tipNew(reason, beneficiary, bnValue.toString());
    } else {
      tx = api.tx.tips.reportAwesome(reason, beneficiary);
    }

    return tx;
  }, [
    beneficiary,
    decimals,
    inputValue,
    reason,
    showErrorToast,
    tabIndex,
    api,
  ]);

  const onInBlock = useCallback(
    (events, blockHash) => {
      const eventData = getEventData(events, "tips", "NewTip");
      if (!eventData || !blockHash) {
        return;
      }
      api?.rpc.chain.getHeader(blockHash).then((header) => {
        const blockNumber = header.number.toNumber();
        const [tipHash] = eventData;
        router.push(`/treasury/tips/${blockNumber}_${tipHash}`);
      });
    },
    [api, router],
  );

  return (
    <>
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Tab tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
      {tabIndex === NewTip ? (
        <NewTipContent
          getTxFunc={getTxFunc}
          onInBlock={onInBlock}
          setBeneficiary={setBeneficiary}
          setReason={setReason}
          setInputValue={setInputValue}
        />
      ) : (
        <ReportAwesomeContent
          getTxFunc={getTxFunc}
          onInBlock={onInBlock}
          setBeneficiary={setBeneficiary}
          setReason={setReason}
        />
      )}
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="New Tip" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
