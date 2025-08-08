import { useAsync } from "react-use";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

export function useTimepoint(callHash) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const multisigAddress = signerAccount?.multisig?.multisigAddress;

  const { value: timepoint, loading: isTimepointLoading } =
    useAsync(async () => {
      if (!api || !multisigAddress || !callHash) {
        return null;
      }
      const multisig = await api.query.multisig?.multisigs(
        multisigAddress,
        callHash,
      );
      if (multisig?.isSome) {
        return multisig.unwrap().when?.toJSON();
      }
      return null;
    }, [api, multisigAddress, callHash]);

  return {
    timepoint,
    isTimepointLoading,
  };
}
