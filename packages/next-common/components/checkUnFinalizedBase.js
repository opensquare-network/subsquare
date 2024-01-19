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
  const [isUnFinalized, setIsUnFinalized] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!api || onChainDataFetcher === noop) {
      return;
    }

    // Check if the proposal is present on-chain
    onChainDataFetcher(api)
      .then((onchainData) => {
        const data = onchainData?.toJSON();
        if (!data) {
          // Proposal is not exist, show 404
          setIsNotFound(true);
          return;
        }

        // Proposal exists on-chain, show un-finalized
        setIsUnFinalized(true);
      })
      .catch(() => {
        setIsNotFound(true);
      });
  }, [api, onChainDataFetcher]);

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
    if (!isUnFinalized) {
      return;
    }

    // Check if server post available
    let timeoutId = null;
    const checkAndRefresh = async () => {
      const available = await checkServerPostAvailable();
      if (available) {
        // Refresh page once server post is available
        router.replace(router.asPath);
        return;
      }
      timeoutId = setTimeout(checkAndRefresh, 6000);
    };
    checkAndRefresh();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isUnFinalized, checkServerPostAvailable, router]);

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <Wrapper>
      <Loading />
      {isUnFinalized && (
        <>
          <H2>Waiting for block confirmation</H2>
          <P>
            We find the proposal on chain but not finalized. This page will be
            refreshed when it gets finalized.
          </P>
        </>
      )}
    </Wrapper>
  );
}
