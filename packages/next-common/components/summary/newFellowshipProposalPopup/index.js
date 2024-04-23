import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { isNil } from "lodash-es";
import { useRouter } from "next/router";
import { isValidPreimageHash } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import { getTypeDef } from "@polkadot/types/create";
import { useContextApi } from "next-common/context/api";
import Param from "next-common/components/extrinsic/params/param";
import { getExtrinsicValues } from "next-common/components/extrinsic";
import SubmissionDeposit from "../newProposalPopup/submissionDeposit";
import PreimageField from "../newProposalPopup/preimageField";
import EnactmentBlocks from "../newProposalPopup/enactmentBlocks";

export default function NewFellowshipProposalPopup({
  onClose,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useState(false);

  const [enactment, setEnactment] = useState();
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");
  const [preimageLength, setPreimageLength] = useState(_preimageLength || "");

  const [proposalOrigin, setProposalOrigin] = useState({ system: "Root" });

  const api = useContextApi();
  const { proposalOriginName, proposalOriginTypeDef } = useMemo(() => {
    if (!api) {
      return {};
    }
    const { name, type } = api.tx.fellowshipReferenda.submit.meta.args[0];
    const typeDef = getTypeDef(type.toString());
    return { proposalOriginName: name, proposalOriginTypeDef: typeDef };
  }, [api]);

  const disabled =
    isNil(proposalOrigin) ||
    isNil(enactment) ||
    !preimageHash ||
    !isValidPreimageHash(preimageHash) ||
    !preimageLength;

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

      const proposalOriginValue = getExtrinsicValues(proposalOrigin);
      let tx = api.tx.fellowshipReferenda.submit(
        proposalOriginValue,
        {
          Lookup: {
            hash: preimageHash,
            len: parseInt(preimageLength),
          },
        },
        enactment,
      );

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      sendTx({
        tx,
        api,
        dispatch,
        isMounted,
        signerAccount,
        setLoading: setIsLoading,
        onInBlock: (eventData) => {
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/fellowship/referenda/${referendumIndex}`);
        },
        section: "fellowshipReferenda",
        method: "Submitted",
        onClose,
      });
    },
    [
      dispatch,
      router,
      isMounted,
      enactment,
      preimageHash,
      preimageLength,
      onClose,
      proposalOrigin,
    ],
  );

  return (
    <SignerPopup
      wide
      title="New Proposal"
      onClose={onClose}
      actionCallback={onSubmit}
      disabled={disabled}
      isLoading={isLoading}
    >
      <Param
        name={proposalOriginName}
        def={proposalOriginTypeDef}
        value={proposalOrigin}
        setValue={setProposalOrigin}
      />
      <PreimageField
        preimageHash={preimageHash}
        preimageLength={preimageLength}
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
      />
      <EnactmentBlocks setEnactment={setEnactment} />
      <SubmissionDeposit />
    </SignerPopup>
  );
}
