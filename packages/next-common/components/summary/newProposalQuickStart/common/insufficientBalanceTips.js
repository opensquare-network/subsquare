import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { SystemNo, SystemYes } from "@osn/icons/subsquare";
import { useMemo } from "react";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import useChainPreimageDepositSettings, {
  usePreimageDeposit,
} from "next-common/hooks/useChainPreimageDeposit";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import Divider from "next-common/components/styled/layout/divider";
import WithApi from "next-common/components/common/withApi";
import { BalanceTipsWrapper } from "./styled";

function YesOrNo({ yes = true }) {
  if (yes) {
    return <SystemYes height={20} width={20} />;
  } else {
    return <SystemNo height={20} width={20} />;
  }
}

function DepositItem({ text, deposit, yes }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <div className="flex items-center justify-between">
      <div>
        {text}&nbsp;
        <span>
          {toPrecision(deposit, decimals)} {symbol}
        </span>
      </div>
      <YesOrNo yes={yes} />
    </div>
  );
}

function DepositCheckTip({ pass }) {
  return (
    <div className="flex items-center justify-between text12Medium">
      {pass ? (
        <span className="text-green500">
          Your free balance is enough to pay deposits.
        </span>
      ) : (
        <span className="text-orange500">
          Your free balance is not enough to pay deposits.
        </span>
      )}
    </div>
  );
}

// Guard that we only show it when we have preimage deposit chain settings
function PreimageDepositSettingGuard({ children }) {
  const settings = useChainPreimageDepositSettings();
  return settings ? children : null;
}

export function PreImageBalanceTips({ preimageDeposit, transferrable }) {
  const isPreimageDepositSufficient =
    BigInt(preimageDeposit) < BigInt(transferrable);

  return (
    <BalanceTipsWrapper>
      <div className="space-y-1">
        <DepositItem
          text="Preimage Deposit:"
          deposit={preimageDeposit}
          yes={isPreimageDepositSufficient}
        />
      </div>
      <Divider />
      <DepositCheckTip pass={isPreimageDepositSufficient} />
    </BalanceTipsWrapper>
  );
}

export function SubmissionBalanceTips({ api, preimageDeposit, transferrable }) {
  const submissionDeposit = useMemo(
    () => api?.consts?.referenda?.submissionDeposit?.toString() || 0,
    [api],
  );
  const isPreimageDepositSufficient =
    BigInt(preimageDeposit) < BigInt(transferrable);
  const isSubmissionDepositSufficient =
    BigInt(submissionDeposit) + BigInt(preimageDeposit) < BigInt(transferrable);

  return (
    <BalanceTipsWrapper>
      <div className="space-y-1">
        <DepositItem
          text="Preimage Deposit:"
          deposit={preimageDeposit}
          yes={isPreimageDepositSufficient}
        />
        <DepositItem
          text="Submission Deposit:"
          deposit={submissionDeposit}
          yes={isSubmissionDepositSufficient}
        />
      </div>
      <Divider />
      <DepositCheckTip pass={isSubmissionDepositSufficient} />
    </BalanceTipsWrapper>
  );
}

function MaybeBalanceTipsContent({ onlyPreimage = false, byteLength }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const { transferrable } = useAccountTransferrable(
    api,
    signerAccount?.realAddress,
  );
  const preimageDeposit = usePreimageDeposit(byteLength);

  if (onlyPreimage) {
    return (
      <PreImageBalanceTips
        preimageDeposit={preimageDeposit}
        transferrable={transferrable}
      />
    );
  }
  return (
    <SubmissionBalanceTips
      api={api}
      preimageDeposit={preimageDeposit}
      transferrable={transferrable}
    />
  );
}

export default function InsufficientBalanceTips({
  byteLength,
  onlyPreimage = false,
}) {
  return (
    <WithApi>
      <PreimageDepositSettingGuard>
        <MaybeBalanceTipsContent
          byteLength={byteLength}
          onlyPreimage={onlyPreimage}
        />
      </PreimageDepositSettingGuard>
    </WithApi>
  );
}
