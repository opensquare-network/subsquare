import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import useMyPool from "../context/myPool";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import BigNumber from "bignumber.js";
import Tooltip from "next-common/components/tooltip";
import Signer from "next-common/components/popup/fields/signerField";

function ClaimPayoutPopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const { symbol, decimals } = useChainSettings();
  const { poolMember, claimable, loading } = useMyPool();

  const getTxFunc = useCallback(() => {
    if (!api || !api.tx.nominationPools) {
      return;
    }

    return api.tx.nominationPools.claimPayout();
  }, [api]);

  const hasClaimable = claimable && BigNumber(claimable).gt(0);

  return (
    <div className="space-y-4">
      <Signer noSwitchSigner />
      <SummaryLayout>
        <SummaryItem title="Bonded">
          <LoadableContent isLoading={loading}>
            <ValueDisplay
              value={toPrecision(poolMember?.points, decimals)}
              symbol={symbol}
            />
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Claimable">
          <LoadableContent isLoading={loading}>
            <ValueDisplay
              value={toPrecision(claimable, decimals)}
              symbol={symbol}
            />
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-between">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <Tooltip content={!hasClaimable && "No claimable rewards"}>
          <TxSubmissionButton disabled={!hasClaimable} getTxFunc={getTxFunc} />
        </Tooltip>
      </div>
    </div>
  );
}

export default function ClaimPayoutPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Claim Payout" onClose={onClose}>
        <ClaimPayoutPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
