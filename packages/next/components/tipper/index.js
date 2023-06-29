import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";
import { emptyFunction, isSameAddress } from "next-common/utils";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import TipperList from "./tipperList";
import useIsCouncilMember from "next-common/utils/hooks/useIsCouncilMember";
import { nodesHeightSelector } from "next-common/store/reducers/nodeSlice";
import { useSelector } from "react-redux";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import CloseTipPopup from "./closeTipPopup";
import RetractTipPopup from "./retractTipPopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useTipIsFinished from "next-common/context/post/treasury/tip/isFinished";
import { useOnchainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";

const EndorsePopup = dynamic(() => import("./endorsePopup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  width: 300px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;

const Description = styled.div`
  font-size: 12px;
  line-height: 140%;
  color: var(--textTertiary);
  > span {
    color: var(--purple500);
    cursor: pointer;
  }
  > span.danger {
    color: var(--red500);
  }
`;

export default function Tipper({
  onEndorseFinalized = emptyFunction,
  onCloseTipFinalized = emptyFunction,
  onRetractFinalized = emptyFunction,
}) {
  const chainData = useOnchainData();
  const realAddress = useRealAddress();
  const [showEndorsePopup, setShowEndorsePopup] = useState(false);
  const [showCloseTipPopup, setShowCloseTipPopup] = useState(false);
  const [showRetractTipPopup, setShowRetractTipPopup] = useState(false);
  const tipIsFinal = useTipIsFinished();
  const userIsTipper = useIsCouncilMember();
  const scanHeight = useSelector(nodesHeightSelector);
  const { hideActionButtons } = useChainSettings();

  const closeFromHeight = chainData.meta?.closes;
  const tipCanClose = !!closeFromHeight && scanHeight > closeFromHeight;
  const tipCanRetract = isSameAddress(chainData.finder, realAddress);
  const tipHash = chainData.hash;

  let closeTipAction = null;
  if (tipCanClose) {
    closeTipAction = (
      <PrimaryButton isFill onClick={() => setShowCloseTipPopup(true)}>
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
  } else if (userIsTipper) {
    action = (
      <>
        {closeTipAction}
        <SecondaryButton isFill onClick={() => setShowEndorsePopup(true)}>
          Endorse
        </SecondaryButton>
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
      <Wrapper>
        <TipperList tipHash={tipHash} />
        {!hideActionButtons && action}
      </Wrapper>
      {showEndorsePopup && (
        <EndorsePopup
          tipHash={tipHash}
          onClose={() => setShowEndorsePopup(false)}
          onFinalized={onEndorseFinalized}
        />
      )}
      {showCloseTipPopup && (
        <CloseTipPopup
          tipHash={tipHash}
          onClose={() => setShowCloseTipPopup(false)}
          onFinalized={onCloseTipFinalized}
        />
      )}
      {showRetractTipPopup && (
        <RetractTipPopup
          tipHash={tipHash}
          onClose={() => setShowRetractTipPopup(false)}
          onFinalized={onRetractFinalized}
        />
      )}
    </>
  );
}
