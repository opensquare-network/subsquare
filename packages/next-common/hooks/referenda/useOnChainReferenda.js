import { useContextApi } from "next-common/context/api";
import { useReferendaPallet } from "next-common/context/referenda/pallet";
import useCall from "next-common/utils/hooks/useCall";

export default function useOnChainReferenda() {
  const pallet = useReferendaPallet();
  const api = useContextApi();
  const {
    value: referenda,
    loading,
    loaded,
  } = useCall(api?.query[pallet]?.referendumInfoFor?.entries, []);
  return { referenda, loading, loaded };
}
