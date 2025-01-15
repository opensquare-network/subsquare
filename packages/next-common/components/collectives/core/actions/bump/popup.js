import useSigner from "next-common/components/common/tx/useSigner";
import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupLabel from "next-common/components/popup/label";
import styled from "styled-components";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { AddressUser } from "next-common/components/user";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";

const Wrapper = styled(GreyPanel)`
  padding: 12px 16px;
  gap: 16px;
`;

function Content() {
  const { who } = usePopupParams();
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();

  const getTxFunc = useCallback(() => {
    if (api && who) {
      return api.tx[pallet].bump(who);
    }
  }, [api, pallet, who]);

  const onInBlock = useCoreFellowshipUpdateFunc();

  return (
    <>
      {component}
      <div>
        <PopupLabel text="Who" />
        <Wrapper>
          <AddressUser add={who} fontSize={14} />
        </Wrapper>
      </div>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function BumpFellowshipMemberPopup(props) {
  return (
    <PopupWithSigner title="Demote" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
