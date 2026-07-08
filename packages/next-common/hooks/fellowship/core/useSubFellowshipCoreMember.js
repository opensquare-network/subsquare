import { useCallback, useEffect, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubFellowshipCoreMember(
  address,
  pallet = "fellowshipCore",
) {
  const [member, setMember] = useState(null);
  useEffect(() => {
    if (!address) {
      setMember(null);
    }
  }, [address]);

  const { loading } = useSubStorage(
    pallet,
    "member",
    address ? [address] : [],
    {
      callback: useCallback((rawOptional) => {
        if (rawOptional.isSome) {
          setMember(rawOptional.unwrap().toJSON());
        }
      }, []),
      skip: !address,
    },
  );

  return { isLoading: loading, member };
}
