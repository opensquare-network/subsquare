import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import CouncilProposeButton, {
  useCouncilProposeTxFunc,
} from "./common/councilProposeButton";
import Tooltip from "next-common/components/tooltip";
import TextInputField from "next-common/components/popup/fields/textInputField";
import ContractTypeTab, { EVM } from "./common/contractTypeTab";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

export default function DappStakingUnRegisterPopup({ isMember }) {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const [contractAddress, setContractAddress] = useState("");
  const [contractType, setContractType] = useState(EVM);
  const { members } = useCollectiveMembers();
  const threshold = Math.ceil((members?.length * 4) / 5);

  const disabled = !contractAddress;

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
      return api.tx.dappStaking.unregister({
        Evm: contractAddress,
      });
    }

    if (!isPolkadotAddress(contractAddress)) {
      throw new Error("Please enter a valid Wasm address");
    }
    return api.tx.dappStaking.unregister({
      Wasm: contractAddress,
    });
  }, [api, contractAddress, contractType]);
  const getProposeTxFunc = useCouncilProposeTxFunc({ threshold, getTxFunc });

  return (
    <Popup title="Dapp staking registration" onClose={onClose}>
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
          <CouncilProposeButton
            threshold={threshold}
            disabled={disabled}
            getTxFunc={getTxFunc}
          />
        </Tooltip>
      </div>
    </Popup>
  );
}
