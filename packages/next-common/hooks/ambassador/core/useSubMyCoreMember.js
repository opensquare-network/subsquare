import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubAmbassadorCoreMember from "./useSubAmbassadorCoreMember";

export default function useSubMyCoreMember() {
  const address = useRealAddress();
  const { isLoading, member } = useSubAmbassadorCoreMember(address);
  return { isLoading, member };
}
