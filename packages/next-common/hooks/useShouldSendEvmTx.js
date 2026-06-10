import { useMemo } from "react";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import shouldSendEvmTx from "next-common/utils/shouldSendEvmTx";

export default function useShouldSendEvmTx() {
  const signerAccount = useSignerAccount();

  return useMemo(() => shouldSendEvmTx(signerAccount), [signerAccount]);
}
