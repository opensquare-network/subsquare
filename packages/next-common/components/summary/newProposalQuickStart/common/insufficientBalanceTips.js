import { useContextApi } from "next-common/context/api";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { SystemNo, SystemYes } from "@osn/icons/subsquare";
import { useMemo } from "react";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import usePreimageDeposit, {
  getPreimageDeposit,
} from "next-common/hooks/useChainPreimageDeposit";

export default function InsufficientBalanceTips({ byteLength }) {
  const api = useContextApi();
  const node = useChainSettings();
  const signerAccount = useSignerAccount();
  const [balance] = useAddressBalance(api, signerAccount?.realAddress);
  const preimage = usePreimageDeposit();

  const preimageDeposit = useMemo(() => {
    return preimage && byteLength
      ? getPreimageDeposit(preimage, byteLength).toString()
      : 0;
  }, [byteLength, preimage]);

  const submissionDeposit = useMemo(() => {
    if (api) {
      return api.consts.referenda?.submissionDeposit.toString();
    }
    return "";
  }, [api]);

  const isPreimageDepositSufficient = balance > preimageDeposit;
  const isSubmissionDepositSufficient = balance > submissionDeposit;

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
