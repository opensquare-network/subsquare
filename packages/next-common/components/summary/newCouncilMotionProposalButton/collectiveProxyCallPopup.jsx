import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import CouncilProposeButton from "./common/councilProposeButton";
import Tooltip from "next-common/components/tooltip";
import { useExtrinsicField } from "next-common/components/popup/fields/extrinsicField";

export default function CollectiveProxyCallPopup({ isMember, onClose }) {
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

  return (
    <Popup
      className="!w-[640px]"
      title="Community proxy call"
      onClose={onClose}
    >
      <SignerWithBalance />
      {extrinsicComponent}
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
