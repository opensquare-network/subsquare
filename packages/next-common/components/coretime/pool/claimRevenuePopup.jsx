import { useCallback, useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import Signer from "next-common/components/popup/fields/signerField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Labeled from "next-common/components/Labeled";
import Tooltip from "next-common/components/tooltip";
import PopupLabel from "next-common/components/popup/label";
import NumberInput from "next-common/lib/input/number";
import AddressUser from "next-common/components/user/addressUser";
import { useContextApi } from "next-common/context/api";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import { isSameAddress } from "next-common/utils";

function PopupContent({ contribution }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const [maxTimeslices, setMaxTimeslices] = useState(
    String(contribution.length ?? 1),
  );
  const { transferrable, isLoading } = useAccountTransferrable(
    api,
    signerAccount?.realAddress,
  );

  const isPayee = isSameAddress(contribution.payee, signerAccount?.realAddress);
  const timeslices = Number(maxTimeslices);

  let disabledReason;
  if (!api) {
    disabledReason = "Waiting for Coretime data";
  } else if (!isPayee) {
    disabledReason = "Only the payee of this contribution receives the revenue";
  } else if (isLoading) {
    disabledReason = "Loading balance...";
  } else if (!timeslices || !Number.isInteger(timeslices) || timeslices < 1) {
    disabledReason = "Please input a valid number of timeslices";
  }

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }

    return api.tx.broker.claimRevenue(
      {
        begin: contribution.begin,
        core: contribution.core,
        mask: contribution.mask,
      },
      timeslices,
    );
  }, [api, contribution, timeslices, disabledReason]);

  return (
    <>
      <Signer
        balance={transferrable}
        isBalanceLoading={isLoading}
        showTransferable
      />
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <Labeled text="Core">#{contribution.core}</Labeled>
        <Labeled text="Length">
          {contribution.length?.toLocaleString()} timeslices
        </Labeled>
        <Labeled text="Payee">
          <AddressUser add={contribution.payee} maxWidth={160} />
        </Labeled>
      </div>
      <div>
        <PopupLabel
          text="Max timeslices"
          tooltip="The maximum number of timeslices processed by this call. Claim the rest of a long region with another call."
        />
        <NumberInput
          value={maxTimeslices}
          placeholder="Enter the number of timeslices"
          symbol="Timeslices"
          onValueChange={setMaxTimeslices}
          controls={false}
        />
      </div>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Claim revenue"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function ClaimRevenuePopup({ contribution, ...props }) {
  return (
    <PopupWithSigner
      title={`Claim revenue of core #${contribution.core}`}
      {...props}
    >
      <PopupContent contribution={contribution} />
    </PopupWithSigner>
  );
}
