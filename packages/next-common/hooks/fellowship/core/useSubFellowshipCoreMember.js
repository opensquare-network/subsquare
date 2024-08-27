import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

export default function useSubFellowshipCoreMember(address) {
  const pallet = useCoreFellowshipPallet();

  const [member, setMember] = useState(null);
  const { loading } = useSubStorage(
    pallet,
    "member",
    [address],
    useCallback((rawOptional) => {
      if (rawOptional.isSome) {
        setMember(rawOptional.unwrap().toJSON());
      }
    }, []),
  );

  return { isLoading: loading, member };
}
