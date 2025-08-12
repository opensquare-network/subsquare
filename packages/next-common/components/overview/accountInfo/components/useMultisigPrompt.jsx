import { PromptTypes } from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Link from "next/link";
import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useExplorerMultisigHistory from "next-common/hooks/multisig/useExplorerMultisigHistory";
import useMultisigAccount from "next-common/hooks/multisig/useMultisigAccount";
import { useChain } from "next-common/context/chain";
import { useRouter } from "next/router";

export default function useMultisigPrompt() {
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.multisigPromptVisible,
    true,
  );
  const router = useRouter();
  const chain = useChain();
  const realAddress = useRealAddress();
  const { total: multisigHistoryTotal } = useExplorerMultisigHistory(
    chain,
    realAddress,
  );
  const { total: multisigAccountTotal } = useMultisigAccount(realAddress);

  return useMemo(() => {
    if (
      !visible ||
      !(!multisigAccountTotal && multisigHistoryTotal) ||
      router.pathname !== "/"
    ) {
      return null;
    }
    return {
      key: CACHE_KEY.multisigPromptVisible,
      message: (
        <div>
          Manage your multisig accounts{" "}
          <Link className="underline" href={"/account/multisigs?tab=accounts"}>
            here
          </Link>
          . You will be able to create multisigs on subsquare.
        </div>
      ),
      type: PromptTypes.INFO,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [
    multisigAccountTotal,
    multisigHistoryTotal,
    router.pathname,
    setVisible,
    visible,
  ]);
}
