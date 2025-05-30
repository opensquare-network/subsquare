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

export function InsufficientBalanceTipsInner({ byteLength }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const { transferrable } = useAccountTransferrable(
    api,
    signerAccount?.realAddress,
  );
  const preimageDeposit = usePreimageDeposit(byteLength);
  const submissionDeposit = useMemo(
    () => api?.consts?.referenda?.submissionDeposit?.toString() || 0,
    [api],
  );

  const isPreimageDepositSufficient =
    BigInt(preimageDeposit) < BigInt(transferrable);
  const isSubmissionDepositSufficient =
    BigInt(submissionDeposit) + BigInt(preimageDeposit) < BigInt(transferrable);

  return (
    <div className="bg-neutral200 rounded-lg px-4 py-2.5 text14Medium text-textSecondary space-y-2">
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
    </div>
  );
}

export default function InsufficientBalanceTips({ byteLength }) {
  return (
    <WithApi>
      <PreimageDepositSettingGuard>
        <InsufficientBalanceTipsInner byteLength={byteLength} />
      </PreimageDepositSettingGuard>
    </WithApi>
  );
}
