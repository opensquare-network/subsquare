import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import CouncilProposeButton from "./common/councilProposeButton";
import Tooltip from "next-common/components/tooltip";
import DeveloperAddress from "./common/developerAddress";
import TextInputField from "next-common/components/popup/fields/textInputField";
import ContractTypeTab, { EVM } from "./common/contractTypeTab";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";

export default function DappStakingRegisterPopup({ isMember, onClose }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const [developerAddress, setDeveloperAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [contractType, setContractType] = useState(EVM);

  const disabled = !developerAddress || !contractAddress;

  useEffect(() => {
    setContractAddress("");
  }, [contractType]);

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    if (contractType === EVM) {
      if (!isEthereumAddress(contractAddress)) {
        dispatch(newErrorToast("Please enter a valid EVM address"));
        return;
      }
      return api.tx.dappStaking.register(developerAddress, {
        Evm: contractAddress,
      });
    }

    if (!isPolkadotAddress(contractAddress)) {
      dispatch(newErrorToast("Please enter a valid Wasm address"));
      return;
    }
    return api.tx.dappStaking.register(developerAddress, {
      Wasm: contractAddress,
    });
  }, [api, developerAddress, contractAddress, contractType, dispatch]);

  return (
    <Popup
      className="!w-[640px]"
      title="Dapp staking registration"
      onClose={onClose}
    >
      <SignerWithBalance />
      <DeveloperAddress
        address={developerAddress}
        setAddress={setDeveloperAddress}
      />
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
