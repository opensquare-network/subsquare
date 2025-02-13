import { useEffect, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";

export async function getMemberData({ section = "fellowship", api, address }) {
  let corePallet;
  let collectivePallet;

  if (section === "fellowship") {
    corePallet = "fellowshipCore";
    collectivePallet = "fellowshipCollective";
  } else if (section === "ambassador") {
    corePallet = "ambassadorCore";
    collectivePallet = "ambassadorCollective";
  }

  const [collectiveMember, coreMember, coreParams] = await Promise.all([
    api.query[collectivePallet].members(address),
    api.query[corePallet].member(address),
    api.query[corePallet].params(),
  ]);

  return {
    collectiveMember: collectiveMember.toJSON(),
    coreMember: coreMember.toJSON(),
    coreParams: coreParams.toJSON(),
  };
}

export default function useMemberData(section = "fellowship") {
  const api = useContextApi();
  const address = useRealAddress();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getMemberData({ api, section, address }).then((data) => {
      setData(data);
      setIsLoading(false);
    });
  }, [address, api, section]);

  return {
    data,
    isLoading,
  };
}
