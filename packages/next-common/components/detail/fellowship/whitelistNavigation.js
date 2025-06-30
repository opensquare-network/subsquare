import React from "react";
import { useOnchainData } from "../../../context/post";
import { NavigationWrapper } from "../navigation/navigators";
import Link from "next/link";
import { useAsync } from "react-use";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import useObjectMemo from "next-common/hooks/useObjectMemo";
import LoadingWhitelistNavigationBar from "../referenda/LoadingWhitelistNavigationBar";

export function ReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/referenda/${referendumIndex}`}>
      {`Referenda #${referendumIndex}`}
    </Link>
  );
}

function OpenGovReferendum({ referendumIndex }) {
  return (
    <div>
      <ReferendumLink referendumIndex={referendumIndex} />
    </div>
  );
}

function PolkadotOpenGovReferendum({ referendumIndex }) {
  return (
    <div>
      <Link href={`https://polkadot.subsquare.io/referenda/${referendumIndex}`}>
        {`Referenda #${referendumIndex}`}
      </Link>
    </div>
  );
}

function FellowshipWhitelistBar() {
  const onchainData = useOnchainData();
  const { openGovReferenda = [] } = onchainData;

  if (!openGovReferenda || openGovReferenda.length === 0) {
    return null;
  }

  return (
    <NavigationWrapper>
      Execution &nbsp;
      {openGovReferenda.map((openGovIndex) => (
        <OpenGovReferendum key={openGovIndex} referendumIndex={openGovIndex} />
      ))}
    </NavigationWrapper>
  );
}
function useWhitelistLinkedReferenda(whitelistedHashesByXcm) {
  const whitelistedHashesByXcmDep = useObjectMemo(whitelistedHashesByXcm);

  return useAsync(async () => {
    if (!whitelistedHashesByXcmDep || whitelistedHashesByXcmDep.length === 0) {
      return [];
    }
    const queryParams = (whitelistedHashesByXcmDep || [])
      .map((hash) => `hash=${hash}`)
      .join("&");
    const url = `https://polkadot-api.subsquare.io/gov2/referenda/whitelist-related?${queryParams}`;

    const responses = await fetch(url);
    if (!responses.ok) {
      throw new Error("Failed to fetch whitelist-related referenda");
    }
    return responses.json();
  }, [whitelistedHashesByXcmDep]);
}

function FellowshipWhitelistBarByXcm() {
  const onchainData = useOnchainData();
  const { whitelistedHashesByXcm } = onchainData;
  const { value: referenda, loading } = useWhitelistLinkedReferenda(
    whitelistedHashesByXcm,
  );

  if (!whitelistedHashesByXcm || whitelistedHashesByXcm.length === 0) {
    return [];
  }

  if (loading && !referenda) {
    return <LoadingWhitelistNavigationBar />;
  }

  if (!referenda || referenda.length === 0) {
    return null;
  }

  return (
    <NavigationWrapper>
      Execution &nbsp;
      {referenda.map((referendum) => (
        <PolkadotOpenGovReferendum
          key={referendum.referendumIndex}
          referendumIndex={referendum.referendumIndex}
        />
      ))}
    </NavigationWrapper>
  );
}

export default function FellowshipWhitelistNavigation() {
  const chain = useChain();

  if (chain === Chains.collectives) {
    return <FellowshipWhitelistBarByXcm />;
  }

  return <FellowshipWhitelistBar />;
}
