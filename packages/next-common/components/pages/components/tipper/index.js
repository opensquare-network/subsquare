import styled from "styled-components";
import { useState } from "react";
import { isSameAddress } from "next-common/utils";
import PrimaryButton from "next-common/lib/button/primary";
import TipperList from "./tipperList";
import { useSelector } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useTipIsFinished from "next-common/context/post/treasury/tip/isFinished";
import { useOnchainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";

const CloseTipPopup = dynamicPopup(() => import("./closeTipPopup"));

const RetractTipPopup = dynamicPopup(() => import("./retractTipPopup"));

const EndorsePopup = dynamicPopup(() => import("./endorsePopup"));

const Description = styled.div`
  font-size: 12px;
  line-height: 140%;
  color: var(--textTertiary);
  > span {
    color: var(--theme500);
    cursor: pointer;
  }
  > span.danger {
    color: var(--red500);
  }
`;

export default function Tipper() {
  const chainData = useOnchainData();
  const realAddress = useRealAddress();
  const [showEndorsePopup, setShowEndorsePopup] = useState(false);
  const [showCloseTipPopup, setShowCloseTipPopup] = useState(false);
  const [showRetractTipPopup, setShowRetractTipPopup] = useState(false);
  const tipIsFinal = useTipIsFinished();
  const { isMember } = useIsCollectiveMember();
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { hideActionButtons } = useChainSettings();

  const closeFromHeight = chainData.meta?.closes;
  const tipCanClose = !!closeFromHeight && latestHeight > closeFromHeight;
  const tipCanRetract = isSameAddress(chainData.finder, realAddress);
  const tipHash = chainData.hash;

  let closeTipAction = null;
  if (tipCanClose) {
    closeTipAction = (
      <PrimaryButton
        className="w-full"
        onClick={() => setShowCloseTipPopup(true)}
      >
        Close tip
      </PrimaryButton>
    );
  }

  let retractTipAction = null;
  if (tipCanRetract) {
    retractTipAction = (
      <>
        As a tip proposer, you can{" "}
        <span className="danger" onClick={() => setShowRetractTipPopup(true)}>
          Retract tip
        </span>
      </>
    );
  }

  let action;
  if (tipIsFinal) {
    action = <Description>This tip has been closed.</Description>;
  } else if (isMember) {
    action = (
      <>
        {closeTipAction}
        <PrimaryButton
          className="w-full"
          onClick={() => setShowEndorsePopup(true)}
        >
          Endorse
        </PrimaryButton>
        <Description>{retractTipAction}</Description>
      </>
    );
  } else {
    action = (
      <>
        {closeTipAction}
        <Description>
          Only council members can tip, no account found from the council.{" "}
          <span onClick={() => setShowEndorsePopup(true)}>Still tip</span>
          <br />
          {retractTipAction}
        </Description>
      </>
    );
  }

  return (
    <>
      <RightBarWrapper>
        <TipperList tipHash={tipHash} />
        {!hideActionButtons && action}
      </RightBarWrapper>
      {showEndorsePopup && (
        <EndorsePopup
          tipHash={tipHash}
          onClose={() => setShowEndorsePopup(false)}
        />
      )}
      {showCloseTipPopup && (
        <CloseTipPopup
          tipHash={tipHash}
          onClose={() => setShowCloseTipPopup(false)}
        />
      )}
      {showRetractTipPopup && (
        <RetractTipPopup
          tipHash={tipHash}
          onClose={() => setShowRetractTipPopup(false)}
        />
      )}
    </>
  );
}
