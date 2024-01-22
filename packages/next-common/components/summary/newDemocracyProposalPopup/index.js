import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useEffect, useState } from "react";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useRouter } from "next/router";
import SubmissionDeposit from "./submissionDeposit";
import LockedBalance from "./lockedBalance";
import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import useApi from "next-common/utils/hooks/useApi";
import { isValidPreimageHash } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import PreimageField from "../newProposalPopup/preimageField";

export default function NewDemocracyProposalPopup({
  onClose,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMounted = useIsMounted();
  const api = useApi();
  const { decimals } = useChainSettings();
  const [deposit, setDeposit] = useState("0");
  const [lockedBalance, setLockedBalance] = useState("0");
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");
  const [preimageLength, setPreimageLength] = useState(_preimageLength || "");

  useEffect(() => {
    if (!api) {
      return;
    }
    const deposit = new BigNumber(api?.consts.democracy?.minimumDeposit || 0)
      .div(Math.pow(10, decimals))
      .toString();

    setDeposit(deposit);
    setLockedBalance(deposit);
  }, [api]);

  const length = usePreimageLength(preimageHash);
  useEffect(() => {
    if (length) {
      setPreimageLength(length);
    }
  }, [length]);

  const onSubmit = useCallback(
    (api, signerAccount) => {
      if (!api || !signerAccount) {
        return;
      }

      const value = new BigNumber(lockedBalance || 0)
        .times(Math.pow(10, decimals))
        .toString();

      let tx = api.tx.democracy.propose(
        {
          Lookup: {
            hash: preimageHash,
            len: parseInt(preimageLength),
          },
        },
        value,
      );

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      sendTx({
        tx,
        api,
        dispatch,
        isMounted,
        signerAddress: signerAccount.address,
        onInBlock: (eventData) => {
          if (!eventData) {
            return;
          }
          const [proposalIndex] = eventData;
          router.push(`/democracy/proposals/${proposalIndex}`);
        },
        section: "democracy",
        method: "Proposed",
        onClose,
      });
    },
    [dispatch, router, isMounted, preimageHash, preimageLength, lockedBalance],
  );

  const disabled = !preimageHash || !isValidPreimageHash(preimageHash);

  return (
    <SignerPopup
      wide
      title="New Proposal"
      onClose={onClose}
      actionCallback={onSubmit}
      disabled={disabled}
    >
      <PreimageField
        preimageHash={preimageHash}
        setPreimageHash={setPreimageHash}
        preimageLength={preimageLength}
        setPreimageLength={preimageLength}
      />
      <LockedBalance
        lockedBalance={lockedBalance}
        setLockedBalance={setLockedBalance}
      />
      <SubmissionDeposit deposit={deposit} />
    </SignerPopup>
  );
}
