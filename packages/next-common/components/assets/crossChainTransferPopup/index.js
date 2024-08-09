import AddressComboField from "next-common/components/popup/fields/addressComboField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import { useCallback, useState } from "react";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import BalanceDisplay from "../balanceDisplay";
import { formatBalance } from "../assetsList";
import dynamic from "next/dynamic";
import ChainIcon from "next-common/components/header/chainIcon";
import Chains from "next-common/utils/consts/chains";
import { cn } from "next-common/utils";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

function Chain({ title, chain, name }) {
  return (
    <div className="flex flex-col grow">
      <PopupLabel text={title} />
      <div
        className={cn(
          "flex border border-neutral400 bg-neutral200 rounded-[8px]",
          "p-[10px] items-center gap-[8px]",
          "text14Medium text-textPrimary",
        )}
      >
        <ChainIcon className="w-[24px] h-[24px]" chain={chain} />
        <span>{name}</span>
      </div>
    </div>
  );
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const address = useRealAddress();
  const dispatch = useDispatch();
  const extensionAccounts = useExtensionAccounts();
  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const getTxFunc = useCallback(() => {
    return;
  }, [dispatch, api, address, transferToAddress, transferAmount]);

  const balanceStatus = (
    <div className="flex gap-[8px] items-center mb-[8px]">
      <span className="text12Medium text-textTertiary">Transferable</span>
      <BalanceDisplay balance={formatBalance(0, 12)} />
    </div>
  );

  return (
    <>
      <div className="flex items-end gap-[12px]">
        <Chain
          title="Destination Chain"
          chain={Chains.polkadot}
          name="Polkadot"
        />
        <div className="my-[3px] p-[8px] rounded-[8px] border border-neutral400 bg-neutral100">
          <SystemCrosschain width={24} height={24} />
        </div>
        <Chain
          title="Source Chain"
          chain={Chains.polkadotAssetHub}
          name="Asset Hub"
        />
      </div>
      <div>
        <PopupLabel text="Amount" status={balanceStatus} />
        <Input
          type="text"
          placeholder="0.00"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value.replace("。", "."))}
          symbol={"DOT"}
        />
      </div>
      <AddressComboField
        title="To Address"
        extensionAccounts={extensionAccounts}
        setAddress={setTransferToAddress}
        placeholder="Please fill the address or select another one..."
      />
      <div>
        <PopupLabel text="Existential Deposit" />
        <Input disabled value="1000" symbol="DOT" />
      </div>
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          onClose={onClose}
        />
      </div>
    </>
  );
}

export function CrossChainTransferPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
