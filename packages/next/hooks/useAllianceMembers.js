import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";

export function useAllianceMembers() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const [members] = useCall(api?.query?.alliance?.members.entries, []);
  useEffect(() => {
    if (!members) {
      setIsLoading(false);
      return;
    }

    const data = members.reduce(
      (
        result,
        [
          {
            args: [role],
          },
          list,
        ]
      ) => {
        const memberRole = role.toJSON();
        const memberList = list.toJSON();
        const curr = { [memberRole?.toLowerCase()]: memberList };
        return {
          ...result,
          ...curr,
        };
      },
      {}
    );
    setData(data);
    setIsLoading(false);
  }, [members]);

  return {
    data,
    isLoading,
  };
}
