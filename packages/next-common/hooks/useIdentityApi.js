import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { getPeopleChain } from "next-common/context/people/api";
import { useChain } from "next-common/context/chain";
import { getChainApi } from "next-common/utils/getChainApi";
import getChainSettings from "next-common/utils/consts/settings";
import { isPeopleChain } from "next-common/utils/chain";

export function useIdentityApi() {
  const chain = useChain();
  const defaultApi = useContextApi();
  const [peopleApi, setPeopleApi] = useState(null);
  const peopleChain = getPeopleChain(chain);

  useEffect(() => {
    if (!peopleChain || isPeopleChain(chain)) {
      return;
    }
    const endpointUrls = getChainSettings(peopleChain)?.endpoints?.map(
      (item) => item.url,
    );
    if (endpointUrls?.length > 0) {
      getChainApi(endpointUrls).then(setPeopleApi);
    }
  }, [peopleChain, chain]);

  if (!peopleChain || isPeopleChain(chain)) {
    return defaultApi;
  }
  return peopleApi;
}
