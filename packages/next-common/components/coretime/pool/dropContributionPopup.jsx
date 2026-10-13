import { useCallback } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Labeled from "next-common/components/Labeled";
import Tooltip from "next-common/components/tooltip";
import AddressUser from "next-common/components/user/addressUser";
import { useContextApi } from "next-common/context/api";

function PopupContent({ contribution, canDrop }) {
  const api = useContextApi();
  const disabledReason = !api
    ? "Waiting for Coretime data"
    : !canDrop
    ? "This contribution is still valid, it can only be dropped after the contribution timeout"
    : null;
  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }

    return api.tx.broker.dropContribution({
      begin: contribution.begin,
      core: contribution.core,
      mask: contribution.mask,
    });
  }, [api, contribution, disabledReason]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <Labeled text="Core">#{contribution.core}</Labeled>
        <Labeled text="Length">
          {contribution.length?.toLocaleString()} timeslices
        </Labeled>
        <Labeled text="Payee">
          <AddressUser add={contribution.payee} maxWidth={160} />
        </Labeled>
      </div>
      <div className="text12Medium text-textTertiary">
        Dropping removes the expired contribution record from the chain. It is
        only housekeeping and does not affect any revenue.
      </div>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Drop contribution"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function DropContributionPopup({
  contribution,
  canDrop,
  ...props
}) {
  return (
    <PopupWithSigner
      title={`Drop contribution of core #${contribution.core}`}
      {...props}
    >
      <PopupContent contribution={contribution} canDrop={canDrop} />
    </PopupWithSigner>
  );
}
