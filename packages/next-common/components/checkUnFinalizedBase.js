import React, { useCallback, useEffect, useState } from "react";
import { noop } from "lodash-es";
import { useRouter } from "next/router";
import Loading from "../assets/imgs/icons/block-loading.svg";
import { H2, P, Wrapper } from "./styled/notFound";
import NotFound from "./notFound";
import { useContextApi } from "next-common/context/api";
import { isEmptyFunc } from "next-common/utils/isEmptyFunc";

export default function CheckUnFinalizedBase({
  onChainDataFetcher = noop,
  serverPostFetcher = noop,
}) {
  const api = useContextApi();
  const router = useRouter();
  const [isUnFinalized, setIsUnFinalized] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!api || isEmptyFunc(onChainDataFetcher)) {
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
    if (isEmptyFunc(serverPostFetcher)) {
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
