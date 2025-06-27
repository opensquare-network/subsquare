import React from "react";
import { useOnchainData } from "../../../context/post";
import { NavigationWrapper } from "../navigation/navigators";
import Link from "next/link";
import { useAsync } from "react-use";
import Loading from "next-common/components/loading";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

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

function FellowshipWhitelistBar(openGovReferenda) {
  return (
    <NavigationWrapper>
      Executed by &nbsp;
      {openGovReferenda.map((openGovIndex) => (
        <OpenGovReferendum key={openGovIndex} referendumIndex={openGovIndex} />
      ))}
    </NavigationWrapper>
  );
}

function LoadingNavigationWrapper() {
  return (
    <NavigationWrapper>
      <Loading size={20} />
    </NavigationWrapper>
  );
}

function FellowshipWhitelistBarByXcm() {
  const onchainData = useOnchainData();
  const { whitelistedHashesByXcm } = onchainData;

  const { value: referenda, loading } = useAsync(async () => {
    if (!whitelistedHashesByXcm || whitelistedHashesByXcm.length === 0) {
      return [];
    }
    const queryParams = (whitelistedHashesByXcm || [])
      .map((hash) => `hash=${hash}`)
      .join("&");
    const url = `https://polkadot-api.subsquare.io/gov2/referenda/whitelist-related?${queryParams}`;

    const responses = await fetch(url);
    if (!responses.ok) {
      throw new Error("Failed to fetch whitelist-related referenda");
    }
    return responses.json();
  }, [whitelistedHashesByXcm]);

  if (!whitelistedHashesByXcm || whitelistedHashesByXcm.length === 0) {
    return [];
  }

  if (loading) {
    return <LoadingNavigationWrapper />;
  }

  if (!referenda || referenda.length === 0) {
    return null;
  }

  return (
    <NavigationWrapper>
      Executed by &nbsp;
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
  const onchainData = useOnchainData();
  const { openGovReferenda = [] } = onchainData;

  if (openGovReferenda.length > 0) {
    return <FellowshipWhitelistBar openGovReferenda={openGovReferenda} />;
  }

  if (chain === Chains.collectives) {
    return <FellowshipWhitelistBarByXcm />;
  }
}
