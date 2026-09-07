import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useChainSettings } from "next-common/context/chain";
import { useCallback, useState } from "react";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

export function useAcceptCuratorPopup(bountyIndex) {
  const [isOpen, setIsOpen] = useState(false);

  const component = isOpen && (
    <AcceptCuratorPopup
      bountyIndex={bountyIndex}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );

  return {
    component,
    showPopupFn() {
      setIsOpen(true);
    },
  };
}

function PopupContent({ bountyIndex }) {
  const { symbol } = useChainSettings();
  const api = useConditionalContextApi();

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.multiAssetBounties?.acceptCurator) {
      return null;
    }

    // accept_curator(parent_bounty_id, child_bounty_id)
    // child_bounty_id is null for a parent bounty.
    return api.tx.multiAssetBounties.acceptCurator(bountyIndex, null);
  }, [api, bountyIndex]);

  return (
    <>
      <SignerWithBalance />
      <div className="text12Normal text-textTertiary">
        {`A curator deposit of 50% of the bounty value (in ${symbol}, min 10, max 200 ${symbol}) will be held until the bounty is paid out or you give up the curator role.`}
      </div>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton title="Confirm" getTxFunc={getTxFunc} />
      </div>
    </>
  );
}

function AcceptCuratorPopup({ bountyIndex, onClose }) {
  return (
    <PopupWithSigner title="Accept Curator" onClose={onClose}>
      <PopupContent bountyIndex={bountyIndex} />
    </PopupWithSigner>
  );
}
