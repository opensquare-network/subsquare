import { useCallback, useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import Signer from "next-common/components/popup/fields/signerField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Tooltip from "next-common/components/tooltip";
import PopupLabel from "next-common/components/popup/label";
import NumberInput from "next-common/lib/input/number";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import AddressDisplay from "next-common/components/popup/fields/addressDisplay";
import { useChainSettings } from "next-common/context/chain";
import { timeslicesPerDay } from "./utils";
import { useContextApi } from "next-common/context/api";
import useCoretimeConfiguration from "next-common/context/coretime/configuration";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";

function DisplayField({ title, children }) {
  return (
    <div>
      <PopupLabel text={title} />
      <GreyPanel className="px-4 py-2.5 text14Medium text-textPrimary border border-neutral400">
        {children}
      </GreyPanel>
    </div>
  );
}

function PopupContent({ contribution }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const configuration = useCoretimeConfiguration();
  // Claiming processes at most the remaining timeslices of the region, so the
  // default covers the whole region while declaring the smallest weight, and is
  // never larger than one bulk period.
  const regionLength = configuration?.regionLength;
  const remainingTimeslices = contribution.length ?? regionLength ?? 0;
  const defaultTimeslices = Math.min(
    ...[regionLength, remainingTimeslices].filter((value) => value > 0),
  );
  const [maxTimeslices, setMaxTimeslices] = useState(
    String(defaultTimeslices || ""),
  );
  const { transferrable, isLoading } = useAccountTransferrable(
    api,
    signerAccount?.realAddress,
  );

  const { blockTime } = useChainSettings();
  const timeSlicesPerDay = timeslicesPerDay(
    api?.consts.broker?.timeslicePeriod?.toNumber(),
    blockTime,
  );
  const remainsDays = timeSlicesPerDay
    ? Number((remainingTimeslices / timeSlicesPerDay).toFixed(1))
    : null;

  const timeslices = Number(maxTimeslices) || defaultTimeslices;

  let disabledReason;
  if (!api) {
    disabledReason = "Waiting for Coretime data";
  } else if (isLoading) {
    disabledReason = "Loading balance...";
  } else if (!Number.isInteger(timeslices) || timeslices < 1) {
    disabledReason = "Please input a valid number of timeslices";
  } else if (remainingTimeslices && timeslices > remainingTimeslices) {
    disabledReason = `Cannot exceed the remaining ${remainingTimeslices.toLocaleString()} timeslices of the region`;
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
      <DisplayField title="Core">#{contribution.core}</DisplayField>
      <DisplayField title="Length">
        {remainingTimeslices.toLocaleString()}
        <span className="text-textTertiary">
          &nbsp; timeslices{remainsDays ? ` ≈ ${remainsDays} days` : ""}
        </span>
      </DisplayField>
      <div>
        <PopupLabel text="Payee" />
        <AddressDisplay
          address={contribution.payee}
          className="border border-neutral400"
        />
      </div>
      <AdvanceSettings>
        <div>
          <PopupLabel
            text="Max timeslices"
            tooltip="The maximum number of timeslices processed by this call, which also decides its weight. It defaults to the remaining region length, up to one bulk period, so one call claims the whole region."
          />
          <NumberInput
            value={maxTimeslices}
            placeholder={String(defaultTimeslices)}
            symbol={`of ${remainingTimeslices.toLocaleString()} timeslices`}
            onValueChange={setMaxTimeslices}
            controls={false}
          />
        </div>
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
    <PopupWithSigner title="Claim revenue" {...props}>
      <PopupContent contribution={contribution} />
    </PopupWithSigner>
  );
}
