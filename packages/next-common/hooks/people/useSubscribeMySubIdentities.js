import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubIdentities from "../identity/useSubIdentities";

export default function useSubscribeMySubIdentities() {
  const address = useRealAddress();
  const api = useContextApi();

  return useSubIdentities(api, address);
}
