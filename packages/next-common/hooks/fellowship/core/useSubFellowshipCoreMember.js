import { useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubFellowshipCoreMember(address) {
  const [member, setMember] = useState(null);
  const { loading } = useSubStorage("fellowshipCore", "member", [address], (rawOptional) => {
    if (rawOptional.isSome) {
      setMember(rawOptional.unwrap().toJSON());
    }
  });

  return { isLoading: loading, member };
}
