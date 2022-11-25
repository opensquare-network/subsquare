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
import { useUser } from "next-common/context/user";
import RetractTipPopup from "./retractTipPopup";

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
  color: ${(props) => props.theme.textTertiary};
  > span {
    color: ${(props) => props.theme.primaryPurple500};
    cursor: pointer;
  }
  > span.danger {
    color: ${(props) => props.theme.secondaryRed500};
  }
`;

export default function Tipper({
  chainData,
  onEndorseFinalized = emptyFunction,
  onCloseTipFinalized = emptyFunction,
  onRetractFinalized = emptyFunction,
}) {
  const loginUser = useUser();
  const [showEndorsePopup, setShowEndorsePopup] = useState(false);
  const [showCloseTipPopup, setShowCloseTipPopup] = useState(false);
  const [showRetractPopup, setShowRetractPopup] = useState(false);

  const userIsTipper = useIsCouncilMember();
  const scanHeight = useSelector(nodesHeightSelector);

  const tipIsFinal = chainData.isFinal;
  const timeline = chainData.timeline;
  const lastTimelineBlockHeight =
    timeline?.[timeline?.length - 1]?.indexer.blockHeight;
  const atBlockHeight = tipIsFinal ? lastTimelineBlockHeight - 1 : undefined;

  const closeFromHeight = chainData.meta?.closes;
  const tipCanClose = !!closeFromHeight && scanHeight > closeFromHeight;
  const tipCanRetract = isSameAddress(chainData.finder, loginUser?.address);
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
        <br />
        As a tip proposer, you can{" "}
        <span className="danger" onClick={() => setShowRetractPopup(true)}>
          Retract tip
        </span>
      </>
    );
  }

  let action = null;
  if (tipIsFinal) {
    action = <Description>This tip has been closed.</Description>;
  } else if (userIsTipper) {
    action = (
      <>
        {closeTipAction}
        <SecondaryButton isFill onClick={() => setShowEndorsePopup(true)}>
          Endorse
        </SecondaryButton>
      </>
    );
  } else {
    action = (
      <>
        {closeTipAction}
        <Description>
          Only council members can tip, no account found from the council.{" "}
          <span onClick={() => setShowEndorsePopup(true)}>Still tip</span>
          {retractTipAction}
        </Description>
      </>
    );
  }

  return (
    <>
      <Wrapper>
        <TipperList tipHash={tipHash} atBlockHeight={atBlockHeight} />
        {action}
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
      {showRetractPopup && (
        <RetractTipPopup
          tipHash={tipHash}
          onClose={() => setShowRetractPopup(false)}
          onFinalized={onRetractFinalized}
        />
      )}
    </>
  );
}
