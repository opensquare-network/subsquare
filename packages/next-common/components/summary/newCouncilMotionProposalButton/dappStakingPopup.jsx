import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import CouncilProposeButton from "./common/councilProposeButton";
import Tooltip from "next-common/components/tooltip";
import TextInputField from "next-common/components/popup/fields/textInputField";
import ContractTypeTab, { EVM } from "./common/contractTypeTab";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import Labeled from "next-common/components/Labeled";
import BalanceInput from "next-common/components/balanceInput";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";

export default function DappStakingPopup({ isMember, onClose }) {
  const { symbol, decimals } = useChainSettings();
  const dispatch = useDispatch();
  const api = useContextApi();
  const [contractAddress, setContractAddress] = useState("");
  const [contractType, setContractType] = useState(EVM);
  const [inputAmount, setInputAmount] = useState("");

  const disabled = !contractAddress || !inputAmount;

  useEffect(() => {
    setContractAddress("");
  }, [contractType]);

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputAmount, decimals, "Stake amount");
    } catch (err) {
      dispatch(newErrorToast(err.message));
      return;
    }

    if (contractType === EVM) {
      if (!isEthereumAddress(contractAddress)) {
        dispatch(newErrorToast("Please enter a valid EVM address"));
        return;
      }
      return api.tx.dappStaking.stake(
        {
          Evm: contractAddress,
        },
        bnValue.toFixed(),
      );
    }

    if (!isPolkadotAddress(contractAddress)) {
      dispatch(newErrorToast("Please enter a valid Wasm address"));
      return;
    }
    return api.tx.dappStaking.stake(
      {
        Wasm: contractAddress,
      },
      bnValue.toFixed(),
    );
  }, [api, contractAddress, contractType, inputAmount, decimals, dispatch]);

  return (
    <Popup
      className="!w-[640px]"
      title="Dapp staking registration"
      onClose={onClose}
    >
      <SignerWithBalance />
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <ContractTypeTab
          tabIndex={contractType}
          setTabIndex={setContractType}
        />
      </div>
      <TextInputField
        title={contractType === EVM ? "EVM contract" : "Wasm contract"}
        text={contractAddress}
        setText={setContractAddress}
      />
      <Labeled text={"Amount"} tooltip={"The stake amount"}>
        <BalanceInput setValue={setInputAmount} symbol={symbol} />
      </Labeled>

      <div className="flex justify-end">
        <Tooltip
          content={
            !isMember ? "Only council members can create proposal" : null
          }
          className="inline"
        >
          <CouncilProposeButton disabled={disabled} getTxFunc={getTxFunc} />
        </Tooltip>
      </div>
    </Popup>
  );
}
