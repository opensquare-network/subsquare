import React, { useCallback, useEffect, useMemo, useState } from "react";
import { chunk, noop } from "lodash-es";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import {
  DEFAULT_CONVICTION_VOTING_CALLS_PER_TX,
  filterConvictionVotingTracks,
  getConvictionVotingCallsPerTx,
} from "next-common/utils/convictionVotingBatch";

export default function UndelegateAllPopup({
  trackIds,
  onClose,
  onInBlock = noop,
}) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const signerAddress = signerAccount?.realAddress;
  const [callsPerTx, setCallsPerTx] = useState(
    DEFAULT_CONVICTION_VOTING_CALLS_PER_TX,
  );

  useEffect(() => {
    let cancelled = false;
    if (
      !api?.tx?.convictionVoting?.undelegate ||
      !signerAddress ||
      !trackIds?.length
    ) {
      return;
    }

    getConvictionVotingCallsPerTx({
      api,
      address: signerAddress,
      sampleCall: api.tx.convictionVoting.undelegate(trackIds[0]),
    }).then((size) => {
      if (!cancelled) {
        setCallsPerTx(size);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [api, signerAddress, trackIds]);

  const chunks = useMemo(
    () => chunk(trackIds || [], callsPerTx),
    [trackIds, callsPerTx],
  );

  const getTxFunc = useCallback(async () => {
    if (!api || !trackIds?.length) {
      return;
    }

    // Skip the tracks that are not delegated anymore, e.g. the tracks of a
    // chunk that already succeeded in a previous attempt. A retried atomic
    // batch must not contain a NotDelegating call.
    const trackIdsToUndelegate = await filterConvictionVotingTracks(
      api,
      signerAddress,
      trackIds,
      (voting) => !!voting?.isDelegating,
    );
    if (trackIdsToUndelegate.length === 0) {
      return;
    }

    const txs = chunk(trackIdsToUndelegate, callsPerTx).map((ids) => {
      const calls = ids.map((trackId) =>
        api.tx.convictionVoting.undelegate(trackId),
      );
      return calls.length === 1 ? calls[0] : api.tx.utility.batch(calls);
    });

    return txs.length === 1 ? txs[0] : txs;
  }, [api, signerAddress, trackIds, callsPerTx]);

  return (
    <SimpleTxPopup
      title="Undelegate All"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    >
      {chunks.length > 1 && (
        <div className="text12Medium text-textTertiary">
          The batch is too large for one transaction, so it will be split into{" "}
          {chunks.length} transactions. Please sign them one by one.
        </div>
      )}
    </SimpleTxPopup>
  );
}
