import { useContextApi } from "next-common/context/api";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";

export default function SigningTip() {
  const api = useContextApi();
  const signerAccount = useSignerAccount();

  const [balance] = useAddressBalance(api, signerAccount?.realAddress);

  const submissionDeposit = api.consts.referenda?.submissionDeposit.toString();

  return (
    <>
      <div className="bg-neutral200 rounded-lg px-4 py-2.5 text14Medium text-textSecondary">
        You&apos;ll be redirected to the referendum detail page after
        transaction submission
      </div>
      {balance < submissionDeposit && (
        <div className="bg-red100 rounded-lg px-4 py-2.5 text14Medium text-textSecondary">
          You haven&apos;t enough balance for the referendum submission deposit.
        </div>
      )}
    </>
  );
}
