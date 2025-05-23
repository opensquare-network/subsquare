import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { SystemNo, SystemYes } from "@osn/icons/subsquare";
import { useMemo } from "react";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import usePreimageDeposit, {
  getPreimageDeposit,
} from "next-common/hooks/useChainPreimageDeposit";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import { BN, BN_ZERO } from "@polkadot/util";

export default function InsufficientBalanceTips({ byteLength }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const node = useChainSettings();
  const preimage = usePreimageDeposit();

  const { transferrable } = useAccountTransferrable(
    api,
    signerAccount?.realAddress,
  );
  const transferrableBalance = new BN(transferrable);

  const preimageDeposit = useMemo(() => {
    return preimage && byteLength
      ? getPreimageDeposit(preimage, byteLength)
      : BN_ZERO;
  }, [byteLength, preimage]);

  const submissionDeposit = useMemo(
    () => api.consts?.referenda?.submissionDeposit || BN_ZERO,
    [api],
  );

  const isPreimageDepositSufficient = preimageDeposit.lt(transferrableBalance);
  const isSubmissionDepositSufficient = submissionDeposit
    .add(preimageDeposit)
    .lt(transferrableBalance);

  return (
    preimage && (
      <div className="bg-neutral200 rounded-lg px-4 py-2.5 text14Medium text-textSecondary space-y-2">
        <div className="flex items-center justify-between">
          <div>
            Preimage Deposit:{" "}
            <span>
              {toPrecision(preimageDeposit, node.decimals)} {node.symbol}
            </span>
          </div>
          {isPreimageDepositSufficient ? (
            <SystemYes height={20} width={20} />
          ) : (
            <SystemNo height={20} width={20} />
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            Submission Deposit:{" "}
            <span>
              {toPrecision(submissionDeposit, node.decimals)} {node.symbol}
            </span>
          </div>
          {isSubmissionDepositSufficient ? (
            <SystemYes height={20} width={20} />
          ) : (
            <SystemNo height={20} width={20} />
          )}
        </div>
      </div>
    )
  );
}
