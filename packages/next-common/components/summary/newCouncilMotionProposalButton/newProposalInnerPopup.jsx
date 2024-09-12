import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Extrinsic from "next-common/components/extrinsic";
import InputNumber from "next-common/components/inputNumber";
import Loading from "next-common/components/loading";
import PopupLabel from "next-common/components/popup/label";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import { useCallback, useEffect, useState } from "react";

export default function NewCouncilMotionProposalInnerPopup({
  onClose,
  onProposed,
}) {
  const pallet = useCollectivePallet();
  const api = useContextApi();
  const [{ proposal, proposalLength }, setProposalState] = useState({
    proposalLength: 0,
  });
  const [threshold, setThreshold] = useState(1);
  const members = useCouncilMembers();

  const thresholdDefault = Math.ceil(members?.length / 2) + 1;
  useEffect(() => {
    setThreshold(thresholdDefault);
  }, [thresholdDefault]);

  const thresholdValid = threshold > 0 && threshold <= members?.length;

  const loading = !api || !members?.length;
  const disabled = !api || !thresholdValid || !proposal;

  const setProposal = useCallback(
    ({ isValid, data }) => {
      if (!api) {
        return;
      }
      if (isValid) {
        setProposalState({
          proposal: data,
          proposalLength: data.encodedLength,
        });
      }
    },
    [api],
  );

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }
    if (!proposal) {
      return;
    }

    const params =
      api.tx[pallet].propose.meta.args.length === 3
        ? [threshold, proposal, proposalLength]
        : [threshold, proposal];

    return api.tx[pallet].propose(...params);
  }, [api, pallet, proposal, proposalLength, threshold]);

  return (
    <Popup
      className="!w-[640px]"
      title="New Proposal"
      maskClosable={false}
      onClose={onClose}
    >
      <SignerWithBalance />

      {loading ? (
        <div className="flex justify-center">
          <Loading size={20} />
        </div>
      ) : (
        <>
          <div>
            <PopupLabel text="Threshold" />
            <InputNumber
              value={threshold || 1}
              setValue={setThreshold}
              min={1}
              max={members?.length}
            />
            {!thresholdValid && (
              <div className="text-red500 text12Medium">
                Threshold must be between 1 and {members?.length}
              </div>
            )}
          </div>

          <div>
            <PopupLabel text="Propose" />
            <Extrinsic
              defaultSectionName="system"
              defaultMethodName="setCode"
              setValue={setProposal}
            />
          </div>
        </>
      )}

      <TxSubmissionButton
        disabled={disabled}
        getTxFunc={getTxFunc}
        onInBlock={() => {
          // TODO: council proposal, trigger list update?
          onProposed();
        }}
        onClose={onClose}
      />
    </Popup>
  );
}
