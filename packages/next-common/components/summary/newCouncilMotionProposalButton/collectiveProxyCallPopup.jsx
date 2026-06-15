import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import CouncilProposeButton, {
  useCouncilProposeTxFunc,
} from "./common/councilProposeButton";
import Tooltip from "next-common/components/tooltip";
import { useExtrinsicField } from "next-common/components/popup/fields/extrinsicField";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

export default function CollectiveProxyCallPopup({ isMember }) {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const { extrinsic: proposal, component: extrinsicComponent } =
    useExtrinsicField({
      defaultSectionName: "dappStaking",
    });
  const disabled = !proposal || !isMember;

  const getTxFunc = useCallback(() => {
    if (!api || !proposal) {
      return;
    }
    return api.tx.collectiveProxy.executeCall(proposal);
  }, [api, proposal]);
  const getProposeTxFunc = useCouncilProposeTxFunc({ getTxFunc });

  return (
    <Popup title="Community proxy call" onClose={onClose}>
      <SignerWithBalance />
      {extrinsicComponent}
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
