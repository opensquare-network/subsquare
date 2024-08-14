import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useCallback, useState } from "react";

export function useFellowshipCollectiveCoreMember(
  address,
  pallet = "fellowshipCore",
) {
  const [member, setMember] = useState();

  useSubStorage(
    pallet,
    "member",
    [address],
    useCallback((rawOptional) => {
      setMember(rawOptional.toJSON());
    }, []),
  );

  return member;
}
