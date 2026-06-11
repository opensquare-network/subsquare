import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import CouncilProposeButton, {
  useCouncilProposeTxFunc,
} from "./common/councilProposeButton";
import Tooltip from "next-common/components/tooltip";
import DeveloperAddress from "./common/developerAddress";
import TextInputField from "next-common/components/popup/fields/textInputField";
import ContractTypeTab, { EVM } from "./common/contractTypeTab";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

export default function DappStakingRegisterPopup({ isMember }) {
  const { onClose } = usePopupParams();
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
        throw new Error("Please enter a valid EVM address");
      }
      return api.tx.dappStaking.register(developerAddress, {
        Evm: contractAddress,
      });
    }

    if (!isPolkadotAddress(contractAddress)) {
      throw new Error("Please enter a valid Wasm address");
    }
    return api.tx.dappStaking.register(developerAddress, {
      Wasm: contractAddress,
    });
  }, [api, developerAddress, contractAddress, contractType]);
  const getProposeTxFunc = useCouncilProposeTxFunc({ getTxFunc });

  return (
    <Popup title="Dapp staking registration" onClose={onClose}>
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
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getProposeTxFunc} />
      </AdvanceSettings>
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
