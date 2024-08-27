import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubFellowshipCoreMember(
  address,
  pallet = "fellowship",
) {
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
