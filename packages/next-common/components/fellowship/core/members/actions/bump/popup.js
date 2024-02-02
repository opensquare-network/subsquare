import useSigner from "next-common/components/common/tx/useSigner";
import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useMemo } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useFellowshipMembersUpdateFunc from "next-common/components/fellowship/core/updateFunc";
import useApi from "next-common/utils/hooks/useApi";
import PopupLabel from "next-common/components/popup/label";
import styled from "styled-components";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { AddressUser } from "next-common/components/user";

const Wrapper = styled(GreyPanel)`
  padding: 12px 16px;
  gap: 16px;
`;

function Content({ onClose, who }) {
  const { component } = useSigner("Origin");
  const api = useApi();

  const tx = useMemo(() => {
    if (api && who) {
      return api.tx.fellowshipCore.bump(who);
    }
  }, [api, who]);

  const onInBlock = useFellowshipMembersUpdateFunc();

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
        tx={tx}
        onClose={onClose}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function Popup(props) {
  return <PopupWithSigner title="Bump" Component={Content} {...props} />;
}
