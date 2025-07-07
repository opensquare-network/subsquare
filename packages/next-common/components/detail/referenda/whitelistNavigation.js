import React from "react";
import { useOnchainData } from "../../../context/post";
import Link from "next/link";
import { NavigationWrapper } from "../navigation/navigators";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { useAsync } from "react-use";
import useObjectMemo from "next-common/hooks/useObjectMemo";

export function FellowshipReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/fellowship/referenda/${referendumIndex}`}>
      {`Fellowship #${referendumIndex}`}
    </Link>
  );
}

function useWhitelistLinkedReferenda(whitelistDispatchedHashes) {
  const whitelistDispatchedHashesDep = useObjectMemo(whitelistDispatchedHashes);

  return useAsync(async () => {
    if (
      !whitelistDispatchedHashesDep ||
      whitelistDispatchedHashesDep.length === 0
    ) {
      return [];
    }
    const queryParams = (whitelistDispatchedHashesDep || [])
      .map((hash) => `hash=${hash}`)
      .join("&");
    const url = `https://collectives-api.subsquare.io/fellowship/referenda/whitelist-related?${queryParams}`;

    const responses = await fetch(url);
    if (!responses.ok) {
      throw new Error("Failed to fetch whitelist-related referenda");
    }
    return responses.json();
  }, [whitelistDispatchedHashesDep]);
}

export function ReferendaWhitelistBarByXcm() {
  const onchainData = useOnchainData();
  const { whitelistDispatchedHashes } = onchainData;
  const { value: referenda } = useWhitelistLinkedReferenda(
    whitelistDispatchedHashes,
  );

  if (!whitelistDispatchedHashes || whitelistDispatchedHashes.length === 0) {
    return [];
  }

  if (!referenda || referenda.length === 0) {
    return null;
  }

  return (
    <NavigationWrapper>
      Whitelist &nbsp;
      {referenda.map((referendum) => (
        <div key={referendum.referendumIndex}>
          <a
            href={`https://collectives.subsquare.io/fellowship/${referendum.referendumIndex}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`Fellowship #${referendum.referendumIndex}`}
          </a>
        </div>
      ))}
    </NavigationWrapper>
  );
}

export function ReferendaWhitelistBar() {
  const onchainData = useOnchainData();
  const { fellowshipReferenda = [] } = onchainData;

  if (fellowshipReferenda.length <= 0) {
    return null;
  }

  const fellowshipReferendumIndex = fellowshipReferenda[0];

  return (
    <NavigationWrapper>
      Whitelist &nbsp;
      <FellowshipReferendumLink referendumIndex={fellowshipReferendumIndex} />
    </NavigationWrapper>
  );
}

export default function ReferendaWhiteListNavigation() {
  const chain = useChain();

  if (chain === Chains.polkadot) {
    return <ReferendaWhitelistBarByXcm />;
  }

  return <ReferendaWhitelistBar />;
}
