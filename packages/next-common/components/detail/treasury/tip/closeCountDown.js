import React from "react";
import useTipMeta from "../../../../utils/hooks/useTipMeta";
import useApi from "../../../../utils/hooks/useApi";
import { usePostState } from "../../../../context/post";
import isNil from "lodash.isnil";
import { TipStateMap } from "../../../../utils/viewfuncs/treasury/normalizeTipListItem";
import useTipCountDown from "../../../../hooks/useTipCountDown";
import { NoticeWrapper } from "../../../styled/containers/titleContainer";
import TreasuryCountDown from "../../../treasury/common/countdown";

export default function CloseCountDown() {
  const api = useApi();
  const meta = useTipMeta();
  const closes = meta.closes;
  const state = usePostState();
  const tipCountdownBlockNum =useTipCountDown();
  if (isNil(closes) || !state || state !== TipStateMap.Tipping) {
    return null;
  }

  if (!api.consts.tips) {
    return null;
  }

  const startHeight = closes - tipCountdownBlockNum;
  return (
    <NoticeWrapper>
      <TreasuryCountDown
        startHeight={startHeight}
        targetHeight={closes}
        prefix="Closable"
      />
    </NoticeWrapper>
  );
}
