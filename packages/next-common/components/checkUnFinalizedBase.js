import React from "react";
import noop from "lodash.noop";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Loading from "../assets/imgs/icons/block-loading.svg";
import useApi from "../utils/hooks/useApi";
import { Wrapper, H2, P } from "./styled/notFound";
import NotFound from "./notFound";

export default function CheckUnFinalizedBase({
  onChainDataFetcher = noop,
  serverPostFetcher = noop,
}) {
  const api = useApi();
  const router = useRouter();
  const [unFinalized, setIsUnFinalized] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // useEffect(() => {
  //   if (!api) {
  //     return;
  //   }

  //   if (onChainDataFetcher === noop) {
  //     return;
  //   }

  //   // Check if the proposal is present on-chain
  //   onChainDataFetcher(api).then((onchainData) => {
  //     const data = onchainData.toJSON();
  //     if (!data) {
  //       // Proposal is not exist, show 404
  //       setNotFound(true);
  //       return;
  //     }

  //     // Proposal exists on-chain, show un-finalized
  //     setIsUnFinalized(true);
  //   });
  // }, [api, onChainDataFetcher, router]);

  const checkServerPostAvailable = useCallback(async () => {
    if (serverPostFetcher === noop) {
      return false;
    }

    const { result } = await serverPostFetcher();
    if (result) {
      // Server post is available
      return true;
    }

    return false;
  }, [serverPostFetcher]);

  useEffect(() => {
    if (!unFinalized) {
      return;
    }

    // Check if server post available
    const intervalId = setInterval(async () => {
      const available = await checkServerPostAvailable();
      if (available) {
        // Refresh page once server post is available
        router.replace(router.asPath);
        clearInterval(intervalId);
      }
    }, 6000);

    return () => {
      clearInterval(intervalId);
    };
  }, [unFinalized, checkServerPostAvailable, router]);

  if (notFound) {
    return <NotFound />;
  }

  return (
    <Wrapper>
      <Loading />
      {unFinalized && (
        <>
          <H2>Waiting for block confirmation</H2>
          <P>
            We found the proposal on chain but not finalized. This page will be
            refreshed when blocks get finalized.
          </P>
        </>
      )}
    </Wrapper>
  );
}
