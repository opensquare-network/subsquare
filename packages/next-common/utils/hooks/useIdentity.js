import { useState, useEffect } from "react";
import { encodeAddressToChain } from "../../services/address";
import getChainSettings from "../consts/settings";

export default function useIdentity(address, chain) {
  const [identity, setIdentity] = useState();

  useEffect(() => {
    if (!address) {
      return;
    }

    const setting = getChainSettings(chain);
    const identityChain = setting.identity;
    const identityAddress = encodeAddressToChain(address, identityChain);
    fetch(
      `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_HOST}/${identityChain}/identity/${identityAddress}`,
    )
      .then((res) => res.json())
      .then((identity) => {
        const isAuthorized = identity?.info?.judgements?.some(
          ([, judgement]) =>
            typeof judgement === "object" &&
            Object.keys(judgement).some((key) =>
              ["reasonable", "knownGood"].includes(key),
            ),
        );
        setIdentity({ isAuthorized, ...identity });
      })
      .catch(() => {});
  }, [address, chain]);

  return identity;
}
