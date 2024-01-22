import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useEffect, useState } from "react";
import PreimageField from "./preimageField";
import { sendTx } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useRouter } from "next/router";
import SubmissionDeposit from "./submissionDeposit";
import LockedBalance from "./lockedBalance";
import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import useApi from "next-common/utils/hooks/useApi";
import { isValidPreimageHash } from "next-common/utils";

export default function NewDemocracyProposalPopup({
  onClose,
  preimageHash: _preimageHash,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMounted = useIsMounted();
  const api = useApi();
  const { decimals } = useChainSettings();
  const [deposit, setDeposit] = useState("0");
  const [lockedBalance, setLockedBalance] = useState("0");
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");

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

  const disabled = !preimageHash || !isValidPreimageHash(preimageHash);

  const onSubmit = useCallback(
    (api, signerAccount) => {
      if (!api || !signerAccount) {
        return;
      }

      const tx = api.tx.democracy.propose(
        {
          Legacy: {
            hash: preimageHash,
          },
        },
        new BigNumber(lockedBalance || 0)
          .times(Math.pow(10, decimals))
          .toString(),
      );

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
    [dispatch, router, isMounted, preimageHash, lockedBalance],
  );

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
      />
      <LockedBalance
        lockedBalance={lockedBalance}
        setLockedBalance={setLockedBalance}
      />
      <SubmissionDeposit deposit={deposit} />
    </SignerPopup>
  );
}
